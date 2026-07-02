import { NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/crmAuth";
import { getCrmStoreAsync, publicUser } from "@/lib/crmStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const payload = getAuthPayload(request);
  if (!payload) return NextResponse.json({ message: "Authentication required." }, { status: 401 });

  const store = await getCrmStoreAsync();
  const user = store.users.find((item) => item.id === payload.userId);
  if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });

  return NextResponse.json({ user: publicUser(user) });
}
