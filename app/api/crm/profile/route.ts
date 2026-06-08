import { NextResponse } from "next/server";
import { getCrmStoreAsync, publicUser, saveCrmStoreAsync } from "@/lib/crmStore";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const body = await request.json();
  const store = await getCrmStoreAsync();
  const user = store.users.find((item) => item.id === body.userId && item.role === "client");

  if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
  user.bankDetails = { ...user.bankDetails, ...(body.bankDetails || {}) };
  if (body.dob !== undefined) user.dob = String(body.dob);
  await saveCrmStoreAsync(store);
  return NextResponse.json({ message: "Profile updated.", user: publicUser(user) });
}
