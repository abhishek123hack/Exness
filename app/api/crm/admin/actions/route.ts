import { NextResponse } from "next/server";
import { getCrmStoreAsync, makeId, publicUser, saveCrmStoreAsync, type RequestStatus } from "@/lib/crmStore";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const body = await request.json();
  const store = await getCrmStoreAsync();

  if (body.action === "signup-status") {
    const user = store.users.find((item) => item.id === body.userId && item.role === "client");
    if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
    user.status = body.status;
    await saveCrmStoreAsync(store);
    return NextResponse.json({ message: `Client ${user.status}.`, user: publicUser(user) });
  }

  if (body.action === "client-block") {
    const user = store.users.find((item) => item.id === body.userId && item.role === "client");
    if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
    user.status = user.status === "Suspended" ? "Approved" : "Suspended";
    await saveCrmStoreAsync(store);
    return NextResponse.json({ message: user.status === "Suspended" ? "Client blocked." : "Client unblocked.", user: publicUser(user) });
  }

  if (body.action === "client-delete") {
    const user = store.users.find((item) => item.id === body.userId && item.role === "client");
    if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
    store.users = store.users.filter((item) => item.id !== body.userId);
    store.deposits = store.deposits.filter((item) => item.userId !== body.userId);
    store.withdrawals = store.withdrawals.filter((item) => item.userId !== body.userId);
    store.kycDocuments = store.kycDocuments.filter((item) => item.userId !== body.userId);
    store.transactions = store.transactions.filter((item) => item.userId !== body.userId);
    await saveCrmStoreAsync(store);
    return NextResponse.json({ message: "Client deleted permanently." });
  }

  if (body.action === "deposit-status") {
    const deposit = store.deposits.find((item) => item.id === body.id);
    if (!deposit) return NextResponse.json({ message: "Deposit not found." }, { status: 404 });
    const user = store.users.find((item) => item.id === deposit.userId);
    if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
    const previous = deposit.status;
    deposit.status = body.status as RequestStatus;
    deposit.adminComment = String(body.adminComment || "");
    deposit.reviewedAt = new Date().toISOString();
    if (body.status === "Approved" && previous !== "Approved") {
      user.wallet.main += deposit.amount;
      user.wallet.totalDeposit += deposit.amount;
      user.balance = user.wallet.main;
      store.transactions.unshift({ id: makeId("TXN"), userId: user.id, type: "Deposit", amount: deposit.amount, note: deposit.adminComment ? `${deposit.method} - ${deposit.adminComment}` : deposit.method, status: "Approved", createdAt: new Date().toISOString() });
    }
    await saveCrmStoreAsync(store);
    return NextResponse.json({ message: `Deposit ${deposit.status}.`, deposit, user: publicUser(user) });
  }

  if (body.action === "withdrawal-status") {
    const withdrawal = store.withdrawals.find((item) => item.id === body.id);
    if (!withdrawal) return NextResponse.json({ message: "Withdrawal not found." }, { status: 404 });
    const user = store.users.find((item) => item.id === withdrawal.userId);
    if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
    const previous = withdrawal.status;
    withdrawal.status = body.status as RequestStatus;
    if ((body.status === "Approved" || body.status === "Paid") && previous !== "Approved" && previous !== "Paid") {
      user.wallet.main -= withdrawal.amount;
      user.wallet.totalWithdrawal += withdrawal.amount;
      user.balance = user.wallet.main;
      store.transactions.unshift({ id: makeId("TXN"), userId: user.id, type: "Withdrawal", amount: withdrawal.amount, note: withdrawal.payoutMethod, status: body.status, createdAt: new Date().toISOString() });
    }
    await saveCrmStoreAsync(store);
    return NextResponse.json({ message: `Withdrawal ${withdrawal.status}.`, withdrawal, user: publicUser(user) });
  }

  if (body.action === "kyc-status") {
    const kyc = store.kycDocuments.find((item) => item.id === body.id || item.userId === body.userId);
    if (!kyc) return NextResponse.json({ message: "KYC request not found." }, { status: 404 });
    const user = store.users.find((item) => item.id === kyc.userId);
    if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
    kyc.status = body.status;
    kyc.adminComment = String(body.adminComment || "");
    kyc.reviewedAt = new Date().toISOString();
    user.kycStatus = body.status;
    await saveCrmStoreAsync(store);
    return NextResponse.json({ message: `KYC ${kyc.status}.`, kyc, user: publicUser(user) });
  }

  if (body.action === "fund") {
    const user = store.users.find((item) => item.id === body.userId && item.role === "client");
    if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
    const amount = Number(body.amount);
    if (!amount || amount <= 0) return NextResponse.json({ message: "Valid amount is required." }, { status: 400 });
    const type = body.type === "Debit" ? "Debit" : body.type === "Bonus" ? "Bonus" : "Credit";
    if (type === "Debit") {
      user.wallet.main -= amount;
      user.wallet.profitLoss -= amount;
    }
    if (type === "Credit") {
      user.wallet.main += amount;
      user.wallet.profitLoss += amount;
    }
    if (type === "Bonus") user.wallet.bonus += amount;
    user.balance = user.wallet.main;
    store.transactions.unshift({ id: makeId("TXN"), userId: user.id, type, amount: type === "Debit" ? -amount : amount, note: String(body.note || "Admin adjustment"), status: "Approved", createdAt: new Date().toISOString() });
    await saveCrmStoreAsync(store);
    return NextResponse.json({ message: `${type} saved.`, user: publicUser(user) });
  }

  if (body.action === "mt5") {
    const user = store.users.find((item) => item.id === body.userId && item.role === "client");
    if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
    user.mt5Account = {
      loginId: String(body.loginId || ""),
      password: String(body.password || ""),
      server: String(body.server || ""),
      leverage: String(body.leverage || ""),
      accountType: String(body.accountType || ""),
      balance: Number(body.balance || 0)
    };
    user.wallet.trading = user.mt5Account.balance;
    await saveCrmStoreAsync(store);
    return NextResponse.json({ message: "MT5 details saved.", user: publicUser(user) });
  }

  if (body.action === "payment-details") {
    store.paymentDetails = { ...store.paymentDetails, [body.method]: { value: String(body.value || ""), note: String(body.note || "") } };
    await saveCrmStoreAsync(store);
    return NextResponse.json({ message: "Payment details updated.", paymentDetails: store.paymentDetails });
  }

  return NextResponse.json({ message: "Invalid admin action." }, { status: 400 });
}
