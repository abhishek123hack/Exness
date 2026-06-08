import { NextResponse } from "next/server";
import { getCrmStoreAsync, publicUser, saveCrmStoreAsync } from "@/lib/crmStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getCrmStoreAsync();
  return NextResponse.json({
    users: store.users.filter((user) => user.role === "client").map(publicUser)
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const store = await getCrmStoreAsync();
  const user = store.users.find((item) => item.id === body.userId);

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  if (!["Approved", "Rejected", "Suspended", "Pending Approval"].includes(body.status)) {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  user.status = body.status;
  await saveCrmStoreAsync(store);
  return NextResponse.json({ message: `Client ${body.status}.`, user: publicUser(user) });
}
