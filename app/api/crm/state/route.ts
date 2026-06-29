import { NextResponse } from "next/server";
import { getCrmStoreAsync, publicUser } from "@/lib/crmStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const store = await getCrmStoreAsync();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const user = userId
    ? store.users.find((item) => item.id === userId)
    : null;

  return NextResponse.json({
    user: user ? publicUser(user) : null,

    users: store.users.map(publicUser),

    clients: store.users
      .filter((item) => item.role === "client")
      .map(publicUser),

    // Cloudinary URL return karo
    deposits: store.deposits,

    withdrawals: store.withdrawals,

    // Cloudinary URL return karo
    kycDocuments: store.kycDocuments,

    transactions: store.transactions,

    paymentDetails: store.paymentDetails,
  });
}