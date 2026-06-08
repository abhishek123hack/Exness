import { NextResponse } from "next/server";
import { getCrmStoreAsync, publicUser, saveCrmStoreAsync, type CrmUser } from "@/lib/crmStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const store = await getCrmStoreAsync();
  const email = String(body.email || "").toLowerCase().trim();

  if (!body.fullName || !email || !body.phone || !body.country || !body.password) {
    return NextResponse.json({ message: "All signup fields are required." }, { status: 400 });
  }

  if (store.users.some((user) => user.email.toLowerCase() === email)) {
    return NextResponse.json({ message: "Email already registered." }, { status: 409 });
  }

  const user: CrmUser = {
    id: `client-${Date.now()}`,
    fullName: body.fullName,
    email,
    phone: body.phone,
    country: body.country,
    password: body.password,
    role: "client" as const,
    status: "Pending Approval" as const,
    balance: 0,
    registeredAt: new Date().toISOString(),
    dob: String(body.dob || ""),
    wallet: { main: 0, trading: 0, bonus: 0, totalDeposit: 0, totalWithdrawal: 0, profitLoss: 0, frozen: false },
    bankDetails: { bankName: "", accountNumber: "", ifsc: "", accountHolder: "", upi: "" },
    panDetails: { panNumber: "", nameOnPan: "", pdfName: "", pdfDataUrl: "" },
    kycStatus: "Pending",
    mt5Account: null
  };

  store.users.push(user);
  await saveCrmStoreAsync(store);

  return NextResponse.json({
    message: "Signup submitted. Your account is pending admin approval.",
    user: publicUser(user)
  });
}
