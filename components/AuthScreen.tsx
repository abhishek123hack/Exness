"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LockKeyhole } from "lucide-react";

const copy = {
  login: ["Login", "Access admin or client panel"],
  signup: ["Client Signup", "Submit account request for admin approval"],
  forgot: ["Forgot Password", "Request password reset"],
  verify: ["Verify Account", "Verify email and phone"],
  twofa: ["2FA Verification", "Enter security code"]
} as const;

export function AuthScreen({ type }: { type: keyof typeof copy }) {
  const [title, subtitle] = copy[type];
  const isSignup = type === "signup";
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    code: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function readApiResponse(response: Response) {
    const text = await response.text();
    try {
      return JSON.parse(text) as { message?: string; user?: unknown; token?: string; redirectTo?: string };
    } catch {
      return { message: text || `API request failed with status ${response.status}.` };
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError(false);

    try {
      if (type === "signup") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
        const data = await readApiResponse(response);
        setError(!response.ok);
        setMessage(data.message || "Signup submitted.");
      } else if (type === "login") {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password })
        });
        const data = await readApiResponse(response);
        setError(!response.ok);
        setMessage(data.message || "Login response received.");
        if (response.ok) {
          localStorage.setItem("nova_crm_user", JSON.stringify(data.user));
          localStorage.setItem("nova_crm_token", data.token || "");
          window.location.href = data.redirectTo || "/client";
        }
      } else {
        setMessage("Request submitted successfully.");
      }
    } catch {
      setError(true);
      setMessage("API is not responding. Please check deployment functions and MONGODB_URI settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#050816] px-4 py-10 text-white">
      <section className="w-full max-w-md rounded border border-white/10 bg-[#0b1b33] shadow-lg">
        <div className="border-b border-white/10 bg-[#0b1b33] px-6 py-5 text-white">
          <img src="/exness-global-logo.svg" alt="Exness Global CRM" className="h-14 w-auto" />
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        </div>
        <form onSubmit={submit} className="grid gap-4 p-6">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-white/55">Simple secure broker backoffice access.</p>
          </div>

          {isSignup && <input value={form.fullName} onChange={(event) => update("fullName", event.target.value)} className="rounded border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-blue-400" placeholder="Full Name" />}
          <input value={type === "twofa" ? form.code : form.email} onChange={(event) => update(type === "twofa" ? "code" : "email", event.target.value)} className="rounded border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-blue-400" placeholder={type === "twofa" ? "6-digit code" : "Email Address"} />
          {isSignup && <input value={form.phone} onChange={(event) => update("phone", event.target.value)} className="rounded border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-blue-400" placeholder="Phone Number" />}
          {isSignup && <input value={form.country} onChange={(event) => update("country", event.target.value)} className="rounded border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-blue-400" placeholder="Country" />}
          {(type === "login" || isSignup) && <input value={form.password} onChange={(event) => update("password", event.target.value)} type="password" className="rounded border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-blue-400" placeholder="Password" />}

          <button disabled={loading} className="flex items-center justify-center gap-2 rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            <LockKeyhole className="h-4 w-4" /> {loading ? "Please wait..." : title}
          </button>

          {message && (
            <div className={`rounded border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
              {message}
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-sm">
            <a href="/auth/login" className="text-blue-200">Login</a>
            <a href="/auth/signup" className="text-blue-200">Signup</a>
            <a href="/auth/forgot-password" className="text-blue-200">Forgot Password</a>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Signup users remain pending until admin approval.
          </div>
        </form>
      </section>
    </main>
  );
}
