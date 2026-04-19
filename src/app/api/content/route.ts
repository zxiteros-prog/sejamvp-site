import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminFromRequest } from "@/lib/admin-auth";

const DATA_PATH = path.join(process.cwd(), "src", "data", "content.json");

function readContent() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeContent(data: Record<string, unknown>) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

type AuditItem = {
  id: string;
  [key: string]: unknown;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
};

function areItemsEquivalent(
  current: AuditItem | undefined,
  incoming: AuditItem,
  keysToCompare: string[]
) {
  if (!current) return false;
  for (const key of keysToCompare) {
    if (JSON.stringify(current[key]) !== JSON.stringify(incoming[key])) {
      return false;
    }
  }
  return true;
}

function applyAuditFields(
  currentItems: AuditItem[],
  incomingItems: AuditItem[],
  editor: string,
  keysToCompare: string[]
) {
  const now = new Date().toISOString();
  const currentById = new Map(currentItems.map((item) => [item.id, item]));

  return incomingItems.map((item) => {
    const existing = currentById.get(item.id);

    if (!existing) {
      return {
        ...item,
        createdBy: editor,
        createdAt: now,
        updatedBy: editor,
        updatedAt: now,
      };
    }

    const changed = !areItemsEquivalent(existing, item, keysToCompare);
    return {
      ...item,
      createdBy: existing.createdBy || editor,
      createdAt: existing.createdAt || now,
      updatedBy: changed ? editor : existing.updatedBy || existing.createdBy || editor,
      updatedAt: changed ? now : existing.updatedAt || existing.createdAt || now,
    };
  });
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = readContent();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to read content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const current = readContent();
    const merged = { ...current, ...body } as Record<string, unknown>;

    const currentCalendar = Array.isArray((current as { calendar?: unknown }).calendar)
      ? ((current as { calendar: AuditItem[] }).calendar ?? [])
      : [];
    const incomingCalendar = Array.isArray((merged as { calendar?: unknown }).calendar)
      ? ((merged as { calendar: AuditItem[] }).calendar ?? [])
      : [];
    const currentUpdates = Array.isArray((current as { updates?: unknown }).updates)
      ? ((current as { updates: AuditItem[] }).updates ?? [])
      : [];
    const incomingUpdates = Array.isArray((merged as { updates?: unknown }).updates)
      ? ((merged as { updates: AuditItem[] }).updates ?? [])
      : [];

    const updated = {
      ...merged,
      calendar: applyAuditFields(
        currentCalendar,
        incomingCalendar,
        admin.username,
        ["date", "title", "description", "type"]
      ),
      updates: applyAuditFields(
        currentUpdates,
        incomingUpdates,
        admin.username,
        ["date", "title", "description", "tags"]
      ),
    };

    writeContent(updated);

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
