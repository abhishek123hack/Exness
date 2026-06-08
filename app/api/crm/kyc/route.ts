import { NextResponse } from "next/server";
import { getCrmStoreAsync, makeId, saveCrmStoreAsync } from "@/lib/crmStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const store = await getCrmStoreAsync();
  const user = store.users.find((item) => item.id === body.userId && item.role === "client");

  if (!user) return NextResponse.json({ message: "Client not found." }, { status: 404 });
  if (!body.panNumber || !body.nameOnPan || !body.pdfName) {
    return NextResponse.json({ message: "PAN number, name and PDF name are required." }, { status: 400 });
  }

  user.panDetails = {
    panNumber: String(body.panNumber),
    nameOnPan: String(body.nameOnPan),
    pdfName: String(body.pdfName),
    pdfDataUrl: String(body.pdfDataUrl || "")
  };
  user.kycStatus = "Pending";

  const existing = store.kycDocuments.find((item) => item.userId === user.id);
  if (existing) {
    existing.panNumber = user.panDetails.panNumber;
    existing.nameOnPan = user.panDetails.nameOnPan;
    existing.pdfName = user.panDetails.pdfName;
    existing.pdfDataUrl = user.panDetails.pdfDataUrl;
    existing.status = "Pending";
    existing.createdAt = new Date().toISOString();
    await saveCrmStoreAsync(store);
    return NextResponse.json({ message: "KYC resubmitted for admin review.", kyc: existing });
  }

  const kyc = {
    id: makeId("KYC", store.kycDocuments.length),
    userId: user.id,
    panNumber: user.panDetails.panNumber,
    nameOnPan: user.panDetails.nameOnPan,
    pdfName: user.panDetails.pdfName,
    pdfDataUrl: user.panDetails.pdfDataUrl,
    status: "Pending" as const,
    createdAt: new Date().toISOString()
  };
  store.kycDocuments.unshift(kyc);
  await saveCrmStoreAsync(store);
  return NextResponse.json({ message: "KYC submitted for admin review.", kyc });
}
