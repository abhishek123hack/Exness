import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const mongoUri = process.env.MONGO_URI?.trim() || "";
  const mongoLooksValid = mongoUri.startsWith("mongodb://") || mongoUri.startsWith("mongodb+srv://");

  return NextResponse.json({
    ok: true,
    api: "online",
    mongoConfigured: Boolean(mongoUri),
    mongoLooksValid,
    message: mongoLooksValid
      ? "CRM API is online and MONGO_URI format looks valid."
      : "CRM API is online. Add a valid MONGO_URI for permanent live data."
  });
}
