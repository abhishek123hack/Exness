import { NextResponse } from "next/server";
import { getCrmStoreAsync, makeId, saveCrmStoreAsync } from "@/lib/crmStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const store = await getCrmStoreAsync();
  const user = store.users.find((item) => item.id === body.userId && item.role === "client");

  if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
  if (user.kycStatus !== "Approved") return NextResponse.json({ message: "KYC approval required before deposit." }, { status: 403 });

  const amount = Number(body.amount);
  if (!amount || amount <= 0) return NextResponse.json({ message: "Valid amount is required." }, { status: 400 });

  const deposit = {
    id: makeId("DEP", store.deposits.length),
    userId: user.id,
    method: body.method || "UPI",
    amount,
    transactionId: String(body.transactionId || ""),
    screenshotUrl: String(body.screenshotUrl || ""),
    proofName: String(body.proofName || body.screenshotUrl || ""),
    proofDataUrl: String(body.proofDataUrl || ""),
    proofPublicId: String(body.proofPublicId || ""),
    status: "Pending" as const,
    createdAt: new Date().toISOString()
  };
  store.deposits.unshift(deposit);
  await saveCrmStoreAsync(store);
  return NextResponse.json({ message: "Deposit request submitted.", deposit });
}
