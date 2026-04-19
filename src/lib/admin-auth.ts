import { createHmac, timingSafeEqual, createHash } from "crypto";
import { NextRequest } from "next/server";

type AdminUser = {
  username: string;
  passwordHash: string;
};

type SessionPayload = {
  username: string;
  iat: number;
  exp: number;
};

export const ADMIN_COOKIE_NAME = "admin_session";

function toBase64Url(input: string) {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "dev-admin-session-secret";
}

function getUsersFromEnv(): AdminUser[] {
  const raw = process.env.ADMIN_USERS_JSON;
  if (!raw) {
    const sharedHash =
      "1e9ac964c5555746875eb98ce0ad5b800890870e16fe374493cc9027225fac0b";
    return [
      {
        username: "leo",
        passwordHash: sharedHash,
      },
      {
        username: "sarigue",
        passwordHash: sharedHash,
      },
      {
        username: "grindel",
        passwordHash: sharedHash,
      },
    ];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (u) =>
        typeof u?.username === "string" && typeof u?.passwordHash === "string"
    );
  } catch {
    return [];
  }
}

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function validateAdminCredentials(username: string, password: string) {
  const users = getUsersFromEnv();
  const user = users.find((u) => u.username === username);
  if (!user) return null;

  const incomingHash = hashPassword(password);
  const userHash = user.passwordHash;

  const incomingBuf = Buffer.from(incomingHash, "utf8");
  const userBuf = Buffer.from(userHash, "utf8");
  if (incomingBuf.length !== userBuf.length) return null;
  if (!timingSafeEqual(incomingBuf, userBuf)) return null;

  return { username: user.username };
}

export function signAdminSession(username: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    username,
    iat: now,
    exp: now + 60 * 60 * 12,
  };

  const payloadEncoded = toBase64Url(JSON.stringify(payload));
  const signature = createHmac("sha256", getSessionSecret())
    .update(payloadEncoded)
    .digest("hex");

  return `${payloadEncoded}.${signature}`;
}

export function verifyAdminSession(token: string | undefined) {
  if (!token) return null;

  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) return null;

  const expectedSignature = createHmac("sha256", getSessionSecret())
    .update(payloadEncoded)
    .digest("hex");

  const sigBuf = Buffer.from(signature, "utf8");
  const expectedBuf = Buffer.from(expectedSignature, "utf8");
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(payloadEncoded)) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!payload?.username || !payload?.exp || payload.exp < now) return null;
    return { username: payload.username };
  } catch {
    return null;
  }
}

export function getAdminFromRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSession(token);
}
