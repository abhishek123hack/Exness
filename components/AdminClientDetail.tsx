"use client";

import { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import type { CrmUser, DepositRequest, KycDocument, Transaction, WithdrawalRequest } from "@/lib/crmStore";

type SafeUser = Omit<CrmUser, "password">;
type State = {
  users: SafeUser[];
  clients: SafeUser[];
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  kycDocuments: KycDocument[];
  transactions: Transaction[];
};

function money(value = 0) {
  return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Badge({ value }: { value: string }) {
  const good = value.toLowerCase().includes("approved") || value.toLowerCase().includes("paid");
  const bad = value.toLowerCase().includes("reject") || value.toLowerCase().includes("suspend");
  return <span className={`rounded px-2.5 py-1 text-xs font-semibold ${good ? "bg-green-100 text-green-700" : bad ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{value}</span>;
}

function Field({ value, setValue, placeholder, type = "text" }: { value: string; setValue: (value: string) => void; placeholder: string; type?: string }) {
  return <input value={value} onChange={(event) => setValue(event.target.value)} type={type} className="rounded border border-slate-700 bg-[#0b1b33] px-4 py-3 text-sm text-white placeholder:text-white/45" placeholder={placeholder} />;
}

export function AdminClientDetail({ clientId }: { clientId: string }) {
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [state, setState] = useState<State | null>(null);
  const [message, setMessage] = useState("");

  const client = state?.clients.find((item) => item.id === clientId) || null;
  const [fundAmount, setFundAmount] = useState("");
  const [fundType, setFundType] = useState("Credit");
  const [fundNote, setFundNote] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [server, setServer] = useState("Exness-Live");
  const [leverage, setLeverage] = useState("1:500");
  const [accountType, setAccountType] = useState("Standard");
  const [balance, setBalance] = useState("0");

  async function load() {
    const res = await fetch("/api/crm/state", { cache: "no-store" });
    const data = await res.json();
    setState(data);
    const current = data.clients.find((item: SafeUser) => item.id === clientId);
    if (current?.mt5Account) {
      setLoginId(current.mt5Account.loginId);
      setPassword(current.mt5Account.password);
      setServer(current.mt5Account.server);
      setLeverage(current.mt5Account.leverage);
      setAccountType(current.mt5Account.accountType);
      setBalance(String(current.mt5Account.balance));
    }
  }

  async function action(body: Record<string, unknown>) {
    const res = await fetch("/api/crm/admin/actions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setMessage(data.message || "Updated");
    await load();
  }

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("nova_crm_user") || "null");
      setAllowed(Boolean(user && user.role === "admin"));
      if (user?.fullName) setAdminName(user.fullName);
      if (user?.role === "admin") load();
    } catch {
      setAllowed(false);
    } finally {
      setChecked(true);
    }
  }, [clientId]);

  if (!checked) return <main className="grid min-h-screen place-items-center bg-slate-100">Checking login...</main>;
  if (!allowed) return <main className="grid min-h-screen place-items-center bg-slate-100 px-4"><section className="w-full max-w-md rounded border border-slate-200 bg-white p-6 text-center shadow-sm"><h1 className="text-2xl font-bold">Admin Login Required</h1><a href="/auth/login" className="mt-5 inline-block rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Go to Login</a></section></main>;
  if (!state) return <main className="grid min-h-screen place-items-center bg-slate-100">Loading client...</main>;
  if (!client) return <main className="grid min-h-screen place-items-center bg-slate-100 px-4"><section className="w-full max-w-md rounded border border-slate-200 bg-white p-6 text-center shadow-sm"><h1 className="text-2xl font-bold">Client Not Found</h1><a href="/admin/clients" className="mt-5 inline-block rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Back to Clients</a></section></main>;

  const deposits = state.deposits.filter((item) => item.userId === client.id);
  const withdrawals = state.withdrawals.filter((item) => item.userId === client.id);
  const kyc = state.kycDocuments.find((item) => item.userId === client.id);
  const transactions = state.transactions.filter((item) => item.userId === client.id);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-72 bg-[#0b1b33] text-white lg:block">
        <div className="border-b border-white/10 p-5"><a href="/admin"><img src="/exness-global-logo.svg" alt="Exness Global CRM" className="h-14 w-auto" /></a><p className="mt-1 text-xs text-white/50">Client Details</p></div>
        <nav className="p-3"><a href="/admin/clients" className="mb-1 flex rounded bg-blue-600 px-4 py-3 text-sm font-medium text-white">Back to Clients</a><a href="/admin/deposits" className="mb-1 flex rounded px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/10">Deposits</a><a href="/admin/withdrawals" className="mb-1 flex rounded px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/10">Withdrawals</a></nav>
        <a href="/auth/login" className="absolute bottom-4 left-3 right-3 flex items-center gap-3 rounded px-4 py-3 text-sm text-white/60 hover:bg-white/10"><LogOut className="h-4 w-4" /> Logout</a>
      </aside>

      <section className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">{client.fullName}</h1><p className="text-sm text-slate-500">Logged in: {adminName}</p></div><button onClick={load} className="rounded border border-slate-300 p-2"><Bell className="h-5 w-5" /></button></div>
        </header>
        <div className="grid gap-5 p-4 md:p-6">
          {message && <div className="rounded border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800">{message}</div>}
          <div className="grid gap-5 lg:grid-cols-2">
            <Info title="Personal Information" rows={[["Name", client.fullName], ["Email", client.email], ["Phone", client.phone], ["Country", client.country], ["DOB", client.dob || "Not set"], ["Registration Date", new Date(client.registeredAt).toLocaleDateString()], ["Account Status", client.status]]} />
            <Info title="Funds & Wallet" rows={[["Total Fund", money(client.wallet.main)], ["Trading Balance", money(client.wallet.trading)], ["Bonus", money(client.wallet.bonus)], ["Total Deposit", money(client.wallet.totalDeposit)], ["Total Withdrawal", money(client.wallet.totalWithdrawal)], ["Frozen", client.wallet.frozen ? "Yes" : "No"]]} />
            <Info title="Bank & UPI Details" rows={[["Bank", client.bankDetails.bankName || "Not set"], ["Account", client.bankDetails.accountNumber || "Not set"], ["IFSC", client.bankDetails.ifsc || "Not set"], ["UPI", client.bankDetails.upi || "Not set"]]} />
            <Info title="PAN & KYC" rows={[["PAN", client.panDetails.panNumber || "Not set"], ["PAN Name", client.panDetails.nameOnPan || "Not set"], ["PAN PDF", client.panDetails.pdfName || "Not uploaded"], ["KYC Status", client.kycStatus], ["Latest KYC Request", kyc?.id || "None"]]} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">Manage Trading Credentials</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field value={loginId} setValue={setLoginId} placeholder="MT5 Login ID" />
                <Field value={password} setValue={setPassword} placeholder="MT5 Password" />
                <Field value={server} setValue={setServer} placeholder="Server Name" />
                <Field value={leverage} setValue={setLeverage} placeholder="Leverage" />
                <Field value={accountType} setValue={setAccountType} placeholder="Account Type" />
                <Field value={balance} setValue={setBalance} placeholder="Balance" type="number" />
              </div>
              <button onClick={() => action({ action: "mt5", userId: client.id, loginId, password, server, leverage, accountType, balance })} className="mt-4 rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Save MT5 Details</button>
            </section>
            <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">Credit / Debit Fund</h2>
              <div className="mt-4 grid gap-4">
                <select value={fundType} onChange={(event) => setFundType(event.target.value)} className="rounded border border-slate-700 bg-[#0b1b33] px-4 py-3 text-sm text-white"><option>Credit</option><option>Debit</option><option>Bonus</option></select>
                <Field value={fundAmount} setValue={setFundAmount} placeholder="Amount" type="number" />
                <Field value={fundNote} setValue={setFundNote} placeholder="Remark" />
              </div>
              <button onClick={() => action({ action: "fund", userId: client.id, type: fundType, amount: fundAmount, note: fundNote })} className="mt-4 rounded bg-green-600 px-5 py-3 text-sm font-semibold text-white">Save Fund Action</button>
            </section>
          </div>

          <MiniList title="Deposits" headers={["ID", "Amount", "Status"]} rows={deposits.map((item) => [item.id, money(item.amount), item.status])} />
          <MiniList title="Withdrawals" headers={["ID", "Amount", "Status"]} rows={withdrawals.map((item) => [item.id, money(item.amount), item.status])} />
          <MiniList title="Transactions" headers={["ID", "Type", "Amount", "Status"]} rows={transactions.map((item) => [item.id, item.type, money(item.amount), item.status])} />
        </div>
      </section>
    </main>
  );
}

function Info({ title, rows }: { title: string; rows: string[][] }) {
  return <section className="rounded border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">{title}</h2><div className="mt-4 grid gap-3 text-sm">{rows.map(([label, value]) => <p key={label}><strong>{label}:</strong> {label.includes("Status") ? <Badge value={value} /> : value}</p>)}</div></section>;
}

function MiniList({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <section className="rounded border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4"><h2 className="text-lg font-bold">{title}</h2></div>
      {rows.length === 0 ? <p className="p-5 text-sm text-slate-500">No records yet.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{headers.map((header) => <th key={header} className="px-5 py-3">{header}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row[0]} className="border-t border-slate-100">{row.map((cell, index) => <td key={index} className="px-5 py-4">{index === row.length - 1 ? <Badge value={cell} /> : cell}</td>)}</tr>)}</tbody></table></div>}
    </section>
  );
}
