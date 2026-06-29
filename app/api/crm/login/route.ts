import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setAuthCookies } from "@/lib/crmAuth";
import { getCrmStoreAsync, publicUser } from "@/lib/crmStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const store = await getCrmStoreAsync();
  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");
  const user = store.users.find((item) => item.email.toLowerCase() === email);
  const passwordOk = user
    ? user.password.startsWith("$2")
      ? await bcrypt.compare(password, user.password)
      : user.password === password
    : false;

  if (!user || !passwordOk) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  if (user.role === "client" && user.status !== "Approved") {
    return NextResponse.json(
      {
        message: `Your account status is ${user.status}. Admin approval is required before login.`,
        status: user.status,
        user: publicUser(user)
      },
      { status: 403 }
    );
  }

  const response = NextResponse.json({
    message: "Login successful.",
    token: "http-only-cookie",
    user: publicUser(user),
    redirectTo: user.role === "admin" ? "/admin" : "/client"
  });
  setAuthCookies(response, { userId: user.id, role: user.role, email: user.email }, Boolean(body.remember));
  return response;
}
