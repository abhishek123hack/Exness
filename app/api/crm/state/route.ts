import { NextResponse } from "next/server";
import { getCrmStoreAsync, publicUser } from "@/lib/crmStore";
import { cleanDoc, connectCrmMongo, CrmModels } from "@/lib/crmModels";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "";
  const clientId = searchParams.get("clientId") || "";
  const mode = searchParams.get("mode") || "";
  const page = searchParams.get("page") || "dashboard";

  const mongo = await connectCrmMongo();
  if (mongo) {
    const user = userId ? cleanDoc(await CrmModels.User.findOne({ id: userId }).select("-password -__v -_id").lean()) : null;
    const base = {
      user,
      users: [],
      clients: [],
      deposits: [],
      withdrawals: [],
      kycDocuments: [],
      transactions: [],
      paymentDetails: (cleanDoc(await CrmModels.PaymentDetails.findOne({ key: "main" }).select("data -_id").lean() || {}) as { data?: unknown }).data || {}
    };

    if (mode === "client" && userId) {
      const [deposits, withdrawals, kycDocuments, transactions] = await Promise.all([
        ["dashboard", "deposits"].includes(page) ? CrmModels.Deposit.find({ userId }).sort({ createdAt: -1 }).limit(page === "dashboard" ? 8 : 50).select("-_id -__v").lean() : [],
        ["dashboard", "withdrawals"].includes(page) ? CrmModels.Withdrawal.find({ userId }).sort({ createdAt: -1 }).limit(page === "dashboard" ? 8 : 50).select("-_id -__v").lean() : [],
        page === "kyc" ? CrmModels.Kyc.find({ userId }).sort({ createdAt: -1 }).limit(5).select("-_id -__v").lean() : CrmModels.Kyc.find({ userId }).sort({ createdAt: -1 }).limit(1).select("-_id -__v").lean(),
        ["dashboard", "deposits", "withdrawals"].includes(page) ? CrmModels.Transaction.find({ userId }).sort({ createdAt: -1 }).limit(20).select("-_id -__v").lean() : []
      ]);
      return NextResponse.json({ ...base, users: user ? [user] : [], clients: user ? [user] : [], deposits: cleanDoc(deposits), withdrawals: cleanDoc(withdrawals), kycDocuments: cleanDoc(kycDocuments), transactions: cleanDoc(transactions) });
    }

    if (mode === "admin") {
      if (page === "client-detail" && clientId) {
        const [client, deposits, withdrawals, kycDocuments, transactions] = await Promise.all([
          CrmModels.User.find({ id: clientId, role: "client" }).select("-password -__v -_id").lean(),
          CrmModels.Deposit.find({ userId: clientId }).sort({ createdAt: -1 }).limit(100).select("-_id -__v").lean(),
          CrmModels.Withdrawal.find({ userId: clientId }).sort({ createdAt: -1 }).limit(100).select("-_id -__v").lean(),
          CrmModels.Kyc.find({ userId: clientId }).sort({ createdAt: -1 }).limit(10).select("-_id -__v").lean(),
          CrmModels.Transaction.find({ userId: clientId }).sort({ createdAt: -1 }).limit(100).select("-_id -__v").lean()
        ]);
        const clients = cleanDoc(client);
        return NextResponse.json({ ...base, users: clients, clients, deposits: cleanDoc(deposits), withdrawals: cleanDoc(withdrawals), kycDocuments: cleanDoc(kycDocuments), transactions: cleanDoc(transactions) });
      }
      const clientsPromise = CrmModels.User.find({ role: "client" }).sort({ createdAt: -1 }).limit(page === "dashboard" ? 20 : 100).select("-password -__v -_id").lean();
      if (page === "deposits") return NextResponse.json({ ...base, clients: cleanDoc(await clientsPromise), deposits: cleanDoc(await CrmModels.Deposit.find({}).sort({ createdAt: -1 }).limit(100).select("-_id -__v").lean()) });
      if (page === "withdrawals") return NextResponse.json({ ...base, clients: cleanDoc(await clientsPromise), withdrawals: cleanDoc(await CrmModels.Withdrawal.find({}).sort({ createdAt: -1 }).limit(100).select("-_id -__v").lean()) });
      if (page === "kyc") return NextResponse.json({ ...base, clients: cleanDoc(await clientsPromise), kycDocuments: cleanDoc(await CrmModels.Kyc.find({}).sort({ createdAt: -1 }).limit(100).select("-_id -__v").lean()) });
      if (["clients", "approvals", "funds", "mt5"].includes(page)) {
        const clients = cleanDoc(await clientsPromise);
        return NextResponse.json({ ...base, users: clients, clients });
      }
      if (page === "settings") return NextResponse.json({ ...base, transactions: cleanDoc(await CrmModels.Transaction.find({}).sort({ createdAt: -1 }).limit(100).select("-_id -__v").lean()) });

      const [clients, deposits, withdrawals, kycDocuments, transactions] = await Promise.all([
        clientsPromise,
        CrmModels.Deposit.find({}).sort({ createdAt: -1 }).limit(50).select("-_id -__v").lean(),
        CrmModels.Withdrawal.find({}).sort({ createdAt: -1 }).limit(50).select("-_id -__v").lean(),
        CrmModels.Kyc.find({}).sort({ createdAt: -1 }).limit(50).select("-_id -__v").lean(),
        CrmModels.Transaction.find({}).sort({ createdAt: -1 }).limit(50).select("-_id -__v").lean()
      ]);
      return NextResponse.json({ ...base, users: cleanDoc(clients), clients: cleanDoc(clients), deposits: cleanDoc(deposits), withdrawals: cleanDoc(withdrawals), kycDocuments: cleanDoc(kycDocuments), transactions: cleanDoc(transactions) });
    }
  }

  const store = await getCrmStoreAsync();
  const user = userId ? store.users.find((item) => item.id === userId) : null;
  const clients = store.users.filter((item) => item.role === "client").map(publicUser);
  const base = {
    user: user ? publicUser(user) : null,
    users: [] as ReturnType<typeof publicUser>[],
    clients: [] as ReturnType<typeof publicUser>[],
    deposits: [],
    withdrawals: [],
    kycDocuments: [],
    transactions: [],
    paymentDetails: store.paymentDetails
  };

  if (mode === "client" && userId) {
    return NextResponse.json({
      ...base,
      users: user ? [publicUser(user)] : [],
      clients: user ? [publicUser(user)] : [],
      deposits: ["dashboard", "deposits"].includes(page) ? store.deposits.filter((item) => item.userId === userId).slice(0, page === "dashboard" ? 8 : 50) : [],
      withdrawals: ["dashboard", "withdrawals"].includes(page) ? store.withdrawals.filter((item) => item.userId === userId).slice(0, page === "dashboard" ? 8 : 50) : [],
      kycDocuments: page === "kyc" ? store.kycDocuments.filter((item) => item.userId === userId) : store.kycDocuments.filter((item) => item.userId === userId).slice(0, 1),
      transactions: ["dashboard", "deposits", "withdrawals"].includes(page) ? store.transactions.filter((item) => item.userId === userId).slice(0, 20) : []
    });
  }

  if (mode === "admin") {
    if (page === "deposits") return NextResponse.json({ ...base, clients, deposits: store.deposits.slice(0, 100) });
    if (page === "withdrawals") return NextResponse.json({ ...base, clients, withdrawals: store.withdrawals.slice(0, 100) });
    if (page === "kyc") return NextResponse.json({ ...base, clients, kycDocuments: store.kycDocuments.slice(0, 100) });
    if (page === "client-detail" && clientId) {
      const scopedClients = clients.filter((item) => item.id === clientId);
      return NextResponse.json({
        ...base,
        users: scopedClients,
        clients: scopedClients,
        deposits: store.deposits.filter((item) => item.userId === clientId).slice(0, 100),
        withdrawals: store.withdrawals.filter((item) => item.userId === clientId).slice(0, 100),
        kycDocuments: store.kycDocuments.filter((item) => item.userId === clientId).slice(0, 10),
        transactions: store.transactions.filter((item) => item.userId === clientId).slice(0, 100)
      });
    }
    if (page === "clients" || page === "approvals" || page === "funds" || page === "mt5") return NextResponse.json({ ...base, users: clients, clients });
    if (page === "settings") return NextResponse.json({ ...base, transactions: store.transactions.slice(0, 100) });
    return NextResponse.json({
      ...base,
      users: clients,
      clients,
      deposits: store.deposits.slice(0, 100),
      withdrawals: store.withdrawals.slice(0, 100),
      kycDocuments: store.kycDocuments.slice(0, 100),
      transactions: store.transactions.slice(0, 100)
    });
  }

  return NextResponse.json({
    ...base,
    users: store.users.map(publicUser),
    clients,
    deposits: store.deposits.slice(0, 100),
    withdrawals: store.withdrawals.slice(0, 100),
    kycDocuments: store.kycDocuments.slice(0, 100),
    transactions: store.transactions.slice(0, 100)
  });
}
