import { NextResponse } from "next/server";
import { getCrmStoreAsync, makeId, saveCrmStoreAsync } from "@/lib/crmStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const store = await getCrmStoreAsync();
  const user = store.users.find((item) => item.id === body.userId && item.role === "client");

  if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
  const amount = Number(body.amount);
  if (!amount || amount <= 0) return NextResponse.json({ message: "Valid amount is required." }, { status: 400 });
  if (amount > user.wallet.main) return NextResponse.json({ message: "Insufficient main wallet balance." }, { status: 400 });

  const withdrawal = {
    id: makeId("WDR"),
    userId: user.id,
    amount,
    payoutMethod: String(body.payoutMethod || ""),
    note: String(body.note || ""),
    status: "Pending" as const,
    createdAt: new Date().toISOString()
  };
  store.withdrawals.unshift(withdrawal);
  await saveCrmStoreAsync(store);
  return NextResponse.json({ message: "Withdrawal request submitted.", withdrawal });
}
