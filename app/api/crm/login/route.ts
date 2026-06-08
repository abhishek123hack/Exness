import { NextResponse } from "next/server";
import { getCrmStoreAsync, publicUser } from "@/lib/crmStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const store = await getCrmStoreAsync();
  const email = String(body.email || "").toLowerCase().trim();
  const user = store.users.find((item) => item.email.toLowerCase() === email && item.password === body.password);

  if (!user) {
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

  return NextResponse.json({
    message: "Login successful.",
    token: `demo-token-${user.id}`,
    user: publicUser(user),
    redirectTo: user.role === "admin" ? "/admin" : "/client"
  });
}
