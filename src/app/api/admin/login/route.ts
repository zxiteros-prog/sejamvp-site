import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  signAdminSession,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = String(body?.username || "").trim();
    const password = String(body?.password || "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuário e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const user = validateAdminCredentials(username, password);
    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user });
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: signAdminSession(user.username),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Falha no login." }, { status: 500 });
  }
}
