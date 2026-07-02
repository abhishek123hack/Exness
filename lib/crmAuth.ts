import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const accessCookie = "eg_access_token";
const refreshCookie = "eg_refresh_token";

function jwtSecret() {
  return process.env.JWT_SECRET || "dev-only-change-this-jwt-secret";
}

export type AuthPayload = {
  userId: string;
  role: "admin" | "client";
  email: string;
};

export function signAccessToken(payload: AuthPayload, remember = false) {
  return jwt.sign(payload, jwtSecret(), { expiresIn: remember ? "7d" : "2h" });
}

export function signRefreshToken(payload: AuthPayload, remember = false) {
  return jwt.sign({ ...payload, type: "refresh" }, jwtSecret(), { expiresIn: remember ? "30d" : "12h" });
}

export function setAuthCookies(response: NextResponse, payload: AuthPayload, remember = false) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(accessCookie, signAccessToken(payload, remember), {
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 2,
    path: "/"
  });
  response.cookies.set(refreshCookie, signRefreshToken(payload, remember), {
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 12,
    path: "/"
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(accessCookie, "", { httpOnly: true, maxAge: 0, path: "/" });
  response.cookies.set(refreshCookie, "", { httpOnly: true, maxAge: 0, path: "/" });
}

export function getAuthPayload(request: Request): AuthPayload | null {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${accessCookie}=`))
    ?.split("=")[1];

  if (!token) return null;
  try {
    const payload = jwt.verify(decodeURIComponent(token), jwtSecret()) as AuthPayload;
    if (!payload.userId || !payload.role) return null;
    return payload;
  } catch {
    return null;
  }
}

export function requireRole(request: Request, role: "admin" | "client") {
  const payload = getAuthPayload(request);
  if (!payload) {
    return { error: NextResponse.json({ message: "Authentication required." }, { status: 401 }) };
  }
  if (payload.role !== role) {
    return { error: NextResponse.json({ message: "Access denied." }, { status: 403 }) };
  }
  return { payload };
}
