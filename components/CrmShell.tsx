"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
import { Bell, CheckCircle2, CreditCard, FileCheck2, Headphones, KeyRound, LayoutDashboard, LogOut, Settings, ShieldCheck, Users, Wallet } from "lucide-react";
import type { CrmUser, DepositRequest, KycDocument, PaymentDetails, Transaction, WithdrawalRequest } from "@/lib/crmStore";

type Mode = "client" | "admin";
type Page = "dashboard" | "deposits" | "withdrawals" | "kyc" | "mt5" | "profile" | "tickets" | "clients" | "approvals" | "funds" | "emails" | "settings" | "crm" | "markets" | "notifications";

type CrmState = {
  user: Omit<CrmUser, "password"> | null;
  users: Omit<CrmUser, "password">[];
  clients: Omit<CrmUser, "password">[];
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  kycDocuments: KycDocument[];
  transactions: Transaction[];
  paymentDetails: PaymentDetails;
};

const clientNav = [
  ["Dashboard", "dashboard", LayoutDashboard],
  ["Deposit", "deposits", CreditCard],
  ["Withdrawal", "withdrawals", Wallet],
  ["KYC Verification", "kyc", FileCheck2],
  ["Trading Account", "mt5", KeyRound],
  ["Support", "tickets", Headphones],
  ["Profile", "profile", ShieldCheck]
] as const;

const adminNav = [
  ["Dashboard", "dashboard", LayoutDashboard],
  ["Clients", "clients", Users],
  ["Signup Approvals", "approvals", CheckCircle2],
  ["KYC Management", "kyc", FileCheck2],
  ["Deposits", "deposits", CreditCard],
  ["Withdrawals", "withdrawals", Wallet],
  ["MT5 Accounts", "mt5", KeyRound],
  ["Fund Management", "funds", Wallet],
  ["Notifications", "emails", Bell],
  ["Support Tickets", "tickets", Headphones],
  ["Settings", "settings", Settings]
] as const;

function money(value = 0) {
  return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDateTime(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function Badge({ value }: { value: string }) {
  const lower = value.toLowerCase();
  const cls = lower.includes("approved") || lower.includes("active") || lower.includes("paid")
    ? "bg-green-100 text-green-700"
    : lower.includes("reject") || lower.includes("suspend")
      ? "bg-red-100 text-red-700"
      : "bg-amber-100 text-amber-700";
  return <span className={`inline-flex rounded px-2.5 py-1 text-xs font-semibold ${cls}`}>{value}</span>;
}

function MobileNav({ nav, mode, page }: { nav: readonly (readonly [string, Page, ElementType])[]; mode: Mode; page: Page }) {
  return (
    <select value={page} onChange={(event) => { window.location.href = `/${mode}/${event.target.value === "dashboard" ? "" : event.target.value}`; }} className="mb-5 w-full rounded border border-slate-300 bg-white px-4 py-3 text-sm font-semibold lg:hidden">
      {nav.map(([label, id]) => <option key={id} value={id}>{label}</option>)}
    </select>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">{text}</div>;
}

function ShellTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>{headers.map((header) => <th key={header} className="px-5 py-3">{header}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Field({ value, setValue, placeholder, type = "text" }: { value: string; setValue: (value: string) => void; placeholder: string; type?: string }) {
  return <input value={value} onChange={(event) => setValue(event.target.value)} type={type} className="rounded border border-slate-700 bg-[#0b1b33] px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-blue-400" placeholder={placeholder} />;
}

const darkSelect = "rounded border border-slate-700 bg-[#0b1b33] px-4 py-3 text-sm text-white outline-none focus:border-blue-400";

async function uploadProofFile(
  file: File,
  callback: (name: string, url: string, publicId: string) => void,
  onProgress?: (progress: number) => void
) {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowed.includes(file.type)) {
    alert("Only JPG, JPEG, PNG and PDF files are allowed.");
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert("Maximum upload size is 10MB.");
    return;
  }

  const uploadFile = file.type.startsWith("image/") ? await compressImage(file) : file;
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("folder", "exness-crm-documents");

  const data = await new Promise<{ url?: string; publicId?: string; error?: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/crm/upload");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch {
        reject(new Error("Upload response failed."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed."));
    xhr.send(formData);
  });

  if (!data.url) {
    alert(data.error || "Upload failed");
    return;
  }

  onProgress?.(100);
  callback(file.name, data.url, data.publicId || "");
}

async function compressImage(file: File) {
  if (file.size < 900 * 1024) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) return file;
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.(png|jpg|jpeg)$/i, ".jpg"), { type: "image/jpeg" });
}

function ProofPreview({ name, dataUrl }: { name: string; dataUrl?: string }) {
  if (!name && !dataUrl) return <span>-</span>;
  if (!dataUrl) return <span>{name}</span>;
  const isImage =
  dataUrl.includes(".jpg") ||
  dataUrl.includes(".jpeg") ||
  dataUrl.includes(".png") ||
  dataUrl.includes(".webp") ||
  dataUrl.includes("/image/");
  return (
    <a href={dataUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 underline">
      {isImage ? <img src={dataUrl} alt={name} className="h-12 w-12 rounded object-cover" /> : null}
      <span>{name || "View file"}</span>
    </a>
  );
}

function ClientDashboard({ user, deposits, withdrawals }: { user: Omit<CrmUser, "password">; deposits: DepositRequest[]; withdrawals: WithdrawalRequest[] }) {
  const stats = [
    ["Total Balance", user.wallet.main, "Approved fund"],
    ["Trading Balance", user.wallet.trading, "MT5 balance"],
    ["Bonus Balance", user.wallet.bonus, "Admin bonus"],
    ["Total Deposit", user.wallet.totalDeposit, `${deposits.filter((item) => item.status === "Approved").length} approved`],
    ["Total Withdrawal", user.wallet.totalWithdrawal, `${withdrawals.filter((item) => item.status === "Paid" || item.status === "Approved").length} paid`],
    ["Profit/Loss", user.wallet.profitLoss, "Trading P/L"]
  ];

  return (
    <div className="grid gap-5">
      {user.kycStatus !== "Approved" && (
        <section className="rounded border border-amber-300 bg-amber-50 p-5 text-amber-900 shadow-sm">
          <h2 className="text-lg font-bold">KYC Required</h2>
          <p className="mt-1 text-sm">Deposit aur full CRM access ke liye pehle PAN KYC submit karein. Current status: <Badge value={user.kycStatus} /></p>
          <a href="/client/kyc" className="mt-4 inline-block rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-white">Complete KYC</a>
        </section>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(([label, value, hint]) => (
          <div key={label as string} className="rounded border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold">{money(Number(value))}</p>
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          </div>
        ))}
      </div>
      <LiveMarkets />
    </div>
  );
}

function AdminDashboard({ state }: { state: CrmState }) {
  const clients = state.clients;
  const totalDeposits = state.deposits.filter((item) => item.status === "Approved").reduce((sum, item) => sum + item.amount, 0);
  const totalWithdrawals = state.withdrawals.filter((item) => item.status === "Approved" || item.status === "Paid").reduce((sum, item) => sum + item.amount, 0);
  const stats = [
    ["Total Clients", clients.length],
    ["Verified Clients", clients.filter((item) => item.kycStatus === "Approved").length],
    ["Pending KYC", state.kycDocuments.filter((item) => item.status === "Pending").length],
    ["Total Deposits", money(totalDeposits)],
    ["Total Withdrawals", money(totalWithdrawals)],
    ["Active Accounts", clients.filter((item) => item.mt5Account).length],
    ["Revenue", money(0)]
  ];
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <LiveMarkets />
    </div>
  );
}

function LiveMarkets() {
  const [rows, setRows] = useState<Array<{ symbol: string; buy: string; sell: string; move: string }>>([]);
  useEffect(() => {
    let active = true;
    async function load() {
      const res = await fetch("/api/crm/live-markets", { cache: "no-store" });
      const data = await res.json();
      if (active) setRows(data.markets || []);
    }
    load();
    const timer = setInterval(load, 3000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  return (
    <section className="rounded border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold">Live Market Watch</h2>
        <p className="text-sm text-slate-500">Forex pairs from live API route</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Symbol</th><th>Buy</th><th>Sell</th><th>Move</th></tr></thead>
          <tbody>{rows.map((item) => <tr key={item.symbol} className="border-t border-slate-100"><td className="px-5 py-4 font-semibold">{item.symbol}</td><td>{item.buy}</td><td>{item.sell}</td><td className={item.move.startsWith("+") ? "text-green-600" : "text-red-600"}>{item.move}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function ClientDeposits({ user, state, reload }: { user: Omit<CrmUser, "password">; state: CrmState; reload: () => void }) {
  const [method, setMethod] = useState<keyof PaymentDetails>("UPI");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [proofName, setProofName] = useState("");
  const [proofDataUrl, setProofDataUrl] = useState("");
  const [proofPublicId, setProofPublicId] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const ownDeposits = state.deposits.filter((item) => item.userId === user.id);

  async function submit() {
    const res = await fetch("/api/crm/deposits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, method, amount, transactionId, screenshotUrl, proofName, proofDataUrl, proofPublicId }) });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) { setAmount(""); setTransactionId(""); setScreenshotUrl(""); setProofName(""); setProofDataUrl(""); reload(); }
  }

  if (user.kycStatus !== "Approved") {
    return (
      <section className="rounded border border-amber-300 bg-amber-50 p-6 text-amber-900 shadow-sm">
        <h2 className="text-xl font-bold">Deposit Page Locked</h2>
        <p className="mt-2 text-sm">Jab tak client KYC submit karke admin se approve nahi karwata, tab tak deposit page locked rahega.</p>
        <div className="mt-4"><Badge value={`KYC ${user.kycStatus}`} /></div>
        <a href="/client/kyc" className="mt-5 inline-block rounded bg-amber-600 px-5 py-3 text-sm font-semibold text-white">Go to KYC Verification</a>
      </section>
    );
  }

  return (
    <div className="grid gap-5">
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Deposit</h2>
        <p className="mt-1 text-sm text-slate-500">Client jo method select karega, sirf uski admin-added details show hongi.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <select value={method} onChange={(event) => setMethod(event.target.value as keyof PaymentDetails)} className={darkSelect}><option>UPI</option><option>Bank Transfer</option><option>USDT</option></select>
          <div className="rounded border border-blue-100 bg-blue-50 p-4 text-sm"><p className="font-bold">{state.paymentDetails[method].value}</p><p className="mt-1 text-slate-600">{state.paymentDetails[method].note}</p></div>
          <Field value={amount} setValue={setAmount} placeholder="Amount" type="number" />
          <Field value={transactionId} setValue={setTransactionId} placeholder={`${method} Transaction ID`} />
          <Field value={screenshotUrl} setValue={setScreenshotUrl} placeholder="Screenshot / proof URL or file name" />
          <label className="rounded border border-slate-700 bg-[#0b1b33] px-4 py-3 text-sm text-white">
            <span className="block text-white/70">Select payment proof: JPG, JPEG, PNG, PDF</span>
           <input
  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
  type="file"
  className="mt-2 block w-full text-sm text-white file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white"
  onChange={(event) => {
    const file = event.target.files?.[0];

    if (file) uploadProofFile(file, (name, url, publicId) => {
      setProofName(name);
      setProofDataUrl(url);
      setProofPublicId(publicId);
      setScreenshotUrl(url);
    }, setUploadProgress);
  }}
/>
            {proofName && <span className="mt-2 block text-xs text-green-300">{proofName} selected</span>}
            {uploadProgress > 0 && uploadProgress < 100 && <span className="mt-2 block text-xs text-cyan-200">Uploading {uploadProgress}%</span>}
          </label>
        </div>
        <button onClick={submit} className="mt-4 rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Submit Deposit</button>
        {message && <p className="mt-3 text-sm font-semibold text-blue-700">{message}</p>}
      </section>
      {ownDeposits.length === 0 ? <Empty text="No deposit request yet." /> : <RequestTable type="deposit" deposits={ownDeposits} />}
    </div>
  );
}

function ClientWithdrawals({ user, state, reload }: { user: Omit<CrmUser, "password">; state: CrmState; reload: () => void }) {
  const saved = [`Bank - ${user.bankDetails.bankName || "Not set"} - ${user.bankDetails.accountNumber || "No account"}`, `UPI - ${user.bankDetails.upi || "Not set"}`];
  const [bankName, setBankName] = useState(user.bankDetails.bankName);
  const [accountNumber, setAccountNumber] = useState(user.bankDetails.accountNumber);
  const [ifsc, setIfsc] = useState(user.bankDetails.ifsc);
  const [accountHolder, setAccountHolder] = useState(user.bankDetails.accountHolder);
  const [upi, setUpi] = useState(user.bankDetails.upi);
  const [amount, setAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState(saved[0]);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const ownWithdrawals = state.withdrawals.filter((item) => item.userId === user.id);

  async function saveBank() {
    const res = await fetch("/api/crm/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, bankDetails: { bankName, accountNumber, ifsc, accountHolder, upi } }) });
    const data = await res.json();
    setMessage(data.message);
    reload();
  }

  async function submit() {
    const res = await fetch("/api/crm/withdrawals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, amount, payoutMethod, note }) });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) { setAmount(""); setNote(""); reload(); }
  }

  return (
    <div className="grid gap-5">
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Save Bank / UPI Details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field value={bankName} setValue={setBankName} placeholder="Bank Name" />
          <Field value={accountNumber} setValue={setAccountNumber} placeholder="Account Number" />
          <Field value={ifsc} setValue={setIfsc} placeholder="IFSC" />
          <Field value={accountHolder} setValue={setAccountHolder} placeholder="Account Holder Name" />
          <Field value={upi} setValue={setUpi} placeholder="UPI ID" />
        </div>
        <button onClick={saveBank} className="mt-4 rounded bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Save Payout Details</button>
      </section>
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Submit Withdrawal Request</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field value={amount} setValue={setAmount} placeholder={`Amount, available ${money(user.wallet.main)}`} type="number" />
          <select value={payoutMethod} onChange={(event) => setPayoutMethod(event.target.value)} className={darkSelect}>{saved.map((item) => <option key={item}>{item}</option>)}</select>
          <Field value={note} setValue={setNote} placeholder="Remark / payout note" />
        </div>
        <button onClick={submit} className="mt-4 rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Submit Withdrawal</button>
        {message && <p className="mt-3 text-sm font-semibold text-blue-700">{message}</p>}
      </section>
      {ownWithdrawals.length === 0 ? <Empty text="No withdrawal request yet." /> : <RequestTable type="withdrawal" withdrawals={ownWithdrawals} />}
    </div>
  );
}

function ClientKyc({ user, state, reload }: { user: Omit<CrmUser, "password">; state: CrmState; reload: () => void }) {
  const [panNumber, setPanNumber] = useState(user.panDetails.panNumber);
  const [nameOnPan, setNameOnPan] = useState(user.panDetails.nameOnPan);
  const [pdfName, setPdfName] = useState(user.panDetails.pdfName);
  const [pdfDataUrl, setPdfDataUrl] = useState(user.panDetails.pdfDataUrl);
  const [pdfPublicId, setPdfPublicId] = useState(user.panDetails.pdfPublicId || "");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const ownKyc = state.kycDocuments.find((item) => item.userId === user.id);
  async function submit() {
    const res = await fetch("/api/crm/kyc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, panNumber, nameOnPan, pdfName, pdfDataUrl, pdfPublicId }) });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) reload();
  }
  return (
    <div className="grid gap-5">
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">PAN Card Verification</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Field value={panNumber} setValue={setPanNumber} placeholder="PAN Number" />
          <Field value={nameOnPan} setValue={setNameOnPan} placeholder="Name as per PAN" />
          <label className="rounded border border-slate-700 bg-[#0b1b33] px-4 py-3 text-sm text-white">
            <span className="block text-white/70">Select PAN file: JPG, JPEG, PNG, PDF</span>
            <input accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" type="file" className="mt-2 block w-full text-sm text-white file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white" onChange={(event) => {
                const file = event.target.files?.[0];
  if (file) uploadProofFile(file, (name, url, publicId) => {
    setPdfName(name);
    setPdfDataUrl(url);
    setPdfPublicId(publicId);
  }, setUploadProgress);
}}
/>
            {pdfName && <span className="mt-2 block text-xs text-green-300">{pdfName} selected</span>}
            {uploadProgress > 0 && uploadProgress < 100 && <span className="mt-2 block text-xs text-cyan-200">Uploading {uploadProgress}%</span>}
          </label>
        </div>
        <button onClick={submit} className="mt-4 rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Submit KYC</button>
        {message && <p className="mt-3 text-sm font-semibold text-blue-700">{message}</p>}
      </section>
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">KYC Status Tracker</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3"><Badge value={ownKyc?.status || user.kycStatus} /><ProofPreview name={ownKyc?.pdfName || user.panDetails.pdfName || "No file submitted yet"} dataUrl={ownKyc?.pdfDataUrl || user.panDetails.pdfDataUrl} /></div>
        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <p><strong className="text-slate-900">Submitted:</strong> {formatDateTime(ownKyc?.createdAt)}</p>
          <p><strong className="text-slate-900">Admin Comment:</strong> {ownKyc?.adminComment || "-"}</p>
        </div>
      </section>
    </div>
  );
}

function ClientTradingAccount({ user }: { user: Omit<CrmUser, "password"> }) {
  if (!user.mt5Account) return <Empty text="Trading Account Pending: admin ne abhi MT5 Login ID, Password, Server, Leverage aur Account Type fill nahi kiya." />;
  return (
    <ShellTable headers={["MT5 Login ID", "Password", "Server Name", "Leverage", "Account Type", "Balance"]}>
      <tr className="border-t border-slate-100"><td className="px-5 py-4 font-semibold">{user.mt5Account.loginId}</td><td>{user.mt5Account.password}</td><td>{user.mt5Account.server}</td><td>{user.mt5Account.leverage}</td><td>{user.mt5Account.accountType}</td><td>{money(user.mt5Account.balance)}</td></tr>
    </ShellTable>
  );
}

function ClientProfile({ user }: { user: Omit<CrmUser, "password"> }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Info title="Personal Details" rows={[["Name", user.fullName], ["Phone", user.phone], ["Email", user.email], ["DOB", user.dob || "Not set"], ["Country", user.country]]} />
      <Info title="Bank Details" rows={[["Bank", user.bankDetails.bankName || "Not set"], ["Account", user.bankDetails.accountNumber || "Not set"], ["IFSC", user.bankDetails.ifsc || "Not set"], ["UPI", user.bankDetails.upi || "Not set"]]} />
      <Info title="PAN Details" rows={[["PAN", user.panDetails.panNumber || "Not set"], ["PAN Name", user.panDetails.nameOnPan || "Not set"], ["PAN PDF", user.panDetails.pdfName || "Not uploaded"], ["KYC Status", user.kycStatus]]} />
    </div>
  );
}

function Info({ title, rows }: { title: string; rows: string[][] }) {
  return <section className="rounded border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">{title}</h2><div className="mt-4 grid gap-3 text-sm">{rows.map(([a, b]) => <p key={a}><strong>{a}:</strong> {a.includes("Status") ? <Badge value={b} /> : b}</p>)}</div></section>;
}

function RequestTable({ type, deposits = [], withdrawals = [] }: { type: "deposit" | "withdrawal"; deposits?: DepositRequest[]; withdrawals?: WithdrawalRequest[] }) {
  if (type === "deposit") return <ShellTable headers={["ID", "Method", "Amount", "Transaction", "Proof", "Submitted", "Admin Comment", "Status"]}>{deposits.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-5 py-4 font-semibold">{item.id}</td><td>{item.method}</td><td>{money(item.amount)}</td><td>{item.transactionId}</td><td><ProofPreview name={item.proofName || item.screenshotUrl} dataUrl={item.proofDataUrl} /></td><td>{formatDateTime(item.createdAt)}</td><td>{item.adminComment || "-"}</td><td><Badge value={item.status} /></td></tr>)}</ShellTable>;
  return <ShellTable headers={["ID", "Amount", "Payout", "Note", "Status"]}>{withdrawals.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-5 py-4 font-semibold">{item.id}</td><td>{money(item.amount)}</td><td>{item.payoutMethod}</td><td>{item.note || "-"}</td><td><Badge value={item.status} /></td></tr>)}</ShellTable>;
}

function AdminClients({ state, action }: { state: CrmState; action: (body: Record<string, unknown>) => void }) {
  return state.clients.length === 0 ? <Empty text="No clients yet." /> : (
    <ShellTable headers={["Client", "Email", "Country", "Balance", "KYC", "Status", "Registered", "Actions"]}>
      {state.clients.map((user) => (
        <tr key={user.id} className="border-t border-slate-100">
          <td className="px-5 py-4 font-semibold">{user.fullName}</td>
          <td>{user.email}</td>
          <td>{user.country}</td>
          <td>{money(user.wallet.main)}</td>
          <td><Badge value={user.kycStatus} /></td>
          <td><Badge value={user.status} /></td>
          <td>{new Date(user.registeredAt).toLocaleDateString()}</td>
          <td>
            <div className="flex flex-wrap gap-2">
              <a href={`/admin/clients/${user.id}`} className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white">View</a>
              <button onClick={() => action({ action: "client-block", userId: user.id })} className="rounded bg-amber-500 px-3 py-2 text-xs font-semibold text-white">
                {user.status === "Suspended" ? "Unblock" : "Block"}
              </button>
              <button onClick={() => {
                if (window.confirm(`Delete ${user.fullName}? This will remove client, KYC, deposits, withdrawals and transactions.`)) {
                  action({ action: "client-delete", userId: user.id });
                }
              }} className="rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white">Delete</button>
            </div>
          </td>
        </tr>
      ))}
    </ShellTable>
  );
}

function AdminApprovals({ state, action }: { state: CrmState; action: (body: Record<string, unknown>) => void }) {
  const pending = state.clients.filter((item) => item.status !== "Approved");
  return pending.length === 0 ? <Empty text="No pending signup approvals." /> : (
    <ShellTable headers={["Client", "Email", "Country", "Status", "Actions"]}>
      {pending.map((user) => (
        <tr key={user.id} className="border-t border-slate-100">
          <td className="px-5 py-4 font-semibold">{user.fullName}</td>
          <td>{user.email}</td>
          <td>{user.country}</td>
          <td><Badge value={user.status} /></td>
          <td className="space-x-2">
            <button onClick={() => action({ action: "signup-status", userId: user.id, status: "Approved" })} className="rounded bg-green-600 px-3 py-2 text-xs font-semibold text-white">Approve</button>
            <button onClick={() => action({ action: "signup-status", userId: user.id, status: "Rejected" })} className="rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white">Reject</button>
          </td>
        </tr>
      ))}
    </ShellTable>
  );
}

function AdminDeposits({ state, action }: { state: CrmState; action: (body: Record<string, unknown>) => void }) {
  const [method, setMethod] = useState<keyof PaymentDetails>("UPI");
  const [value, setValue] = useState(state.paymentDetails.UPI.value);
  const [note, setNote] = useState(state.paymentDetails.UPI.note);
  useEffect(() => { setValue(state.paymentDetails[method].value); setNote(state.paymentDetails[method].note); }, [method, state.paymentDetails]);
  return (
    <div className="grid gap-5">
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Edit Deposit Payment Details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3"><select value={method} onChange={(e) => setMethod(e.target.value as keyof PaymentDetails)} className={darkSelect}><option>UPI</option><option>Bank Transfer</option><option>USDT</option></select><Field value={value} setValue={setValue} placeholder="Payment details" /><Field value={note} setValue={setNote} placeholder="Instructions" /></div>
        <button onClick={() => action({ action: "payment-details", method, value, note })} className="mt-4 rounded bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Save Details</button>
      </section>
      {state.deposits.length === 0 ? <Empty text="No deposit requests. Client deposit submit karega to yahan approve/reject action ayega." /> : (
        <ShellTable headers={["ID", "Client", "Method", "Amount", "TXN", "Proof", "Submitted", "Comment", "Status", "Actions"]}>
          {state.deposits.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-5 py-4 font-semibold">{item.id}</td><td>{state.clients.find((u) => u.id === item.userId)?.fullName}</td><td>{item.method}</td><td>{money(item.amount)}</td><td>{item.transactionId}</td><td><ProofPreview name={item.proofName || item.screenshotUrl} dataUrl={item.proofDataUrl} /></td><td>{formatDateTime(item.createdAt)}</td><td>{item.adminComment || "-"}</td><td><Badge value={item.status} /></td><td><AdminReviewActions defaultComment={item.adminComment} onSubmit={(status, adminComment) => action({ action: "deposit-status", id: item.id, status, adminComment })} actions={[["Approved", "Approve", "bg-green-600"], ["Rejected", "Reject", "bg-red-600"]]} /></td></tr>)}
        </ShellTable>
      )}
    </div>
  );
}

function AdminWithdrawals({ state, action }: { state: CrmState; action: (body: Record<string, unknown>) => void }) {
  return state.withdrawals.length === 0 ? <Empty text="No withdrawal requests. Client request submit karega to yahan approve/reject/paid action ayega." /> : (
    <ShellTable headers={["ID", "Client", "Amount", "Payout", "Status", "Actions"]}>
      {state.withdrawals.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-5 py-4 font-semibold">{item.id}</td><td>{state.clients.find((u) => u.id === item.userId)?.fullName}</td><td>{money(item.amount)}</td><td>{item.payoutMethod}</td><td><Badge value={item.status} /></td><td className="space-x-2"><button onClick={() => action({ action: "withdrawal-status", id: item.id, status: "Approved" })} className="rounded bg-green-600 px-3 py-2 text-xs font-semibold text-white">Approve</button><button onClick={() => action({ action: "withdrawal-status", id: item.id, status: "Rejected" })} className="rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white">Reject</button><button onClick={() => action({ action: "withdrawal-status", id: item.id, status: "Paid" })} className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Paid</button></td></tr>)}
    </ShellTable>
  );
}

function AdminKyc({ state, action }: { state: CrmState; action: (body: Record<string, unknown>) => void }) {
  return state.kycDocuments.length === 0 ? <Empty text="No KYC requests. Demo client KYC submit karega to yahan approve/reject hoga." /> : (
    <ShellTable headers={["ID", "Client", "PAN", "File Preview", "Submitted", "Comment", "Status", "Actions"]}>
      {state.kycDocuments.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-5 py-4 font-semibold">{item.id}</td><td>{state.clients.find((u) => u.id === item.userId)?.fullName}</td><td>{item.panNumber}</td><td><ProofPreview name={item.pdfName} dataUrl={item.pdfDataUrl} /></td><td>{formatDateTime(item.createdAt)}</td><td>{item.adminComment || "-"}</td><td><Badge value={item.status} /></td><td><AdminReviewActions defaultComment={item.adminComment} onSubmit={(status, adminComment) => action({ action: "kyc-status", id: item.id, status, adminComment })} actions={[["Approved", "Approve", "bg-green-600"], ["Rejected", "Reject", "bg-red-600"], ["Reupload Requested", "Reupload", "bg-amber-500"]]} /></td></tr>)}
    </ShellTable>
  );
}

function AdminReviewActions({ defaultComment = "", onSubmit, actions }: { defaultComment?: string; onSubmit: (status: string, adminComment: string) => void; actions: [string, string, string][] }) {
  const [adminComment, setAdminComment] = useState(defaultComment);
  return (
    <div className="grid min-w-[220px] gap-2">
      <input value={adminComment} onChange={(event) => setAdminComment(event.target.value)} className="rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" placeholder="Admin comment" />
      <div className="flex flex-wrap gap-2">
        {actions.map(([status, label, color]) => <button key={status} onClick={() => onSubmit(status, adminComment)} className={`rounded px-3 py-2 text-xs font-semibold text-white ${color}`}>{label}</button>)}
      </div>
    </div>
  );
}

function AdminMt5({ state, action }: { state: CrmState; action: (body: Record<string, unknown>) => void }) {
  const client = state.clients[0];
  const [loginId, setLoginId] = useState(client?.mt5Account?.loginId || "");
  const [password, setPassword] = useState(client?.mt5Account?.password || "");
  const [server, setServer] = useState(client?.mt5Account?.server || "Exness-Live");
  const [leverage, setLeverage] = useState(client?.mt5Account?.leverage || "1:500");
  const [accountType, setAccountType] = useState(client?.mt5Account?.accountType || "Standard");
  const [balance, setBalance] = useState(String(client?.mt5Account?.balance || 0));
  if (!client) return <Empty text="No client available." />;
  return <section className="rounded border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">Assign MT5 To {client.fullName}</h2><div className="mt-4 grid gap-4 md:grid-cols-3"><Field value={loginId} setValue={setLoginId} placeholder="MT5 Login ID" /><Field value={password} setValue={setPassword} placeholder="MT5 Password" /><Field value={server} setValue={setServer} placeholder="Server Name" /><Field value={leverage} setValue={setLeverage} placeholder="Leverage" /><Field value={accountType} setValue={setAccountType} placeholder="Account Type" /><Field value={balance} setValue={setBalance} placeholder="Balance" type="number" /></div><button onClick={() => action({ action: "mt5", userId: client.id, loginId, password, server, leverage, accountType, balance })} className="mt-4 rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Save MT5</button></section>;
}

function AdminFunds({ state, action }: { state: CrmState; action: (body: Record<string, unknown>) => void }) {
  const client = state.clients[0];
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Credit");
  const [note, setNote] = useState("");
  if (!client) return <Empty text="No client available." />;
  return <div className="grid gap-5"><section className="rounded border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">Credit / Debit {client.fullName}</h2><div className="mt-4 grid gap-4 md:grid-cols-3"><select value={type} onChange={(event) => setType(event.target.value)} className={darkSelect}><option>Credit</option><option>Debit</option><option>Bonus</option></select><Field value={amount} setValue={setAmount} placeholder="Amount" type="number" /><Field value={note} setValue={setNote} placeholder="Remark" /></div><button onClick={() => action({ action: "fund", userId: client.id, type, amount, note })} className="mt-4 rounded bg-green-600 px-5 py-3 text-sm font-semibold text-white">Save Fund Action</button></section><Transactions state={state} userId={client.id} /></div>;
}

function Transactions({ state, userId }: { state: CrmState; userId?: string }) {
  const rows = userId ? state.transactions.filter((item) => item.userId === userId) : state.transactions;
  return rows.length === 0 ? <Empty text="No transactions yet." /> : <ShellTable headers={["ID", "Type", "Amount", "Note", "Status"]}>{rows.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-5 py-4 font-semibold">{item.id}</td><td>{item.type}</td><td>{money(item.amount)}</td><td>{item.note}</td><td><Badge value={item.status} /></td></tr>)}</ShellTable>;
}

function Content({ mode, page, state, user, reload, action }: { mode: Mode; page: Page; state: CrmState; user: Omit<CrmUser, "password">; reload: () => void; action: (body: Record<string, unknown>) => void }) {
  if (mode === "client") {
    if (page === "dashboard") return <ClientDashboard user={user} deposits={state.deposits.filter((item) => item.userId === user.id)} withdrawals={state.withdrawals.filter((item) => item.userId === user.id)} />;
    if (page === "deposits") return <ClientDeposits user={user} state={state} reload={reload} />;
    if (page === "withdrawals") return <ClientWithdrawals user={user} state={state} reload={reload} />;
    if (page === "kyc") return <ClientKyc user={user} state={state} reload={reload} />;
    if (page === "mt5") return <ClientTradingAccount user={user} />;
    if (page === "profile") return <ClientProfile user={user} />;
    return <Empty text="Support ticket module is ready for API expansion." />;
  }
  if (page === "dashboard") return <AdminDashboard state={state} />;
  if (page === "clients") return <AdminClients state={state} action={action} />;
  if (page === "approvals") return <AdminApprovals state={state} action={action} />;
  if (page === "deposits") return <AdminDeposits state={state} action={action} />;
  if (page === "withdrawals") return <AdminWithdrawals state={state} action={action} />;
  if (page === "kyc") return <AdminKyc state={state} action={action} />;
  if (page === "mt5") return <AdminMt5 state={state} action={action} />;
  if (page === "funds") return <AdminFunds state={state} action={action} />;
  if (page === "settings") return <Transactions state={state} />;
  return <Empty text="Module connected shell ready." />;
}

export function CrmShell({ mode, page = "dashboard" }: { mode: Mode; page?: Page }) {
  const nav = mode === "admin" ? adminNav : clientNav;
  const [authChecked, setAuthChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [loginUser, setLoginUser] = useState<Omit<CrmUser, "password"> | null>(null);
  const [state, setState] = useState<CrmState | null>(null);
  const [message, setMessage] = useState("");

  const title = mode === "admin" ? "Admin Panel" : "Client Panel";
  const subtitle = mode === "admin" ? "Backend connected: clients, KYC, deposits, withdrawals, funds and MT5." : "Fresh client area connected to CRM API.";

  async function load(userId?: string) {
    const id = userId || loginUser?.id;
    const res = await fetch(`/api/crm/state${id ? `?userId=${id}` : ""}`, { cache: "no-store" });
    const data = await res.json();
    setState(data);
    if (id && data.user) {
      setLoginUser(data.user);
      localStorage.setItem("nova_crm_user", JSON.stringify(data.user));
    }
  }

  async function adminAction(body: Record<string, unknown>) {
    const res = await fetch("/api/crm/admin/actions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setMessage(data.message || "Updated");
    await load();
  }

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("nova_crm_user") || "null");
      setAllowed(Boolean(user && user.role === mode));
      setLoginUser(user);
      if (user && user.role === mode) load(user.id);
    } catch {
      setAllowed(false);
    } finally {
      setAuthChecked(true);
    }
  }, [mode]);

  const currentUser = useMemo(() => {
  if (!state || !loginUser) return null;

  const users = state.users || [];

  return users.find((item) => item.id === loginUser.id) || loginUser;
}, [state, loginUser]);

  if (!authChecked) return <main className="grid min-h-screen place-items-center bg-slate-100 text-slate-700">Checking login...</main>;
  if (!allowed) return <main className="grid min-h-screen place-items-center bg-slate-100 px-4 text-slate-900"><section className="w-full max-w-md rounded border border-slate-200 bg-white p-6 text-center shadow-sm"><h1 className="text-2xl font-bold">Login Required</h1><p className="mt-3 text-sm text-slate-500">Valid email aur password se login zaroori hai.</p><a href="/auth/login" className="mt-5 inline-block rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Go to Login</a></section></main>;
  if (!state || !currentUser) return <main className="grid min-h-screen place-items-center bg-slate-100 text-slate-700">Loading CRM API...</main>;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 bg-[#0b1b33] text-white lg:block">
        <div className="border-b border-white/10 p-5"><a href="/" className="inline-flex"><img src="/exness-global-logo.svg" alt="Exness Global CRM" className="h-14 w-auto" /></a><p className="mt-1 text-xs text-white/50">{mode === "admin" ? "Broker Backoffice" : "Client Area"}</p></div>
        <nav className="p-3">{nav.map(([label, id, Icon]) => <a key={id} href={`/${mode}/${id === "dashboard" ? "" : id}`} className={`mb-1 flex items-center gap-3 rounded px-4 py-3 text-sm font-medium ${page === id ? "bg-blue-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" /> {label}</a>)}</nav>
        <a href="/auth/login" onClick={() => localStorage.removeItem("nova_crm_user")} className="absolute bottom-4 left-3 right-3 flex items-center gap-3 rounded px-4 py-3 text-sm text-white/60 hover:bg-white/10"><LogOut className="h-4 w-4" /> Logout</a>
      </aside>
      <section className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div><h1 className="text-2xl font-bold">{title}</h1><p className="text-sm text-slate-500">{subtitle}</p><p className="mt-1 text-sm font-semibold text-slate-700">Logged in: {currentUser.fullName}</p></div>
            <button onClick={() => load()} className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold">Refresh</button>
          </div>
        </header>
        <div className="p-4 md:p-6">
          <MobileNav nav={nav} mode={mode} page={page} />
          {message && <div className="mb-5 rounded border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800">{message}</div>}
          <Content mode={mode} page={page} state={state} user={currentUser} reload={() => load()} action={adminAction} />
        </div>
      </section>
    </main>
  );
}
