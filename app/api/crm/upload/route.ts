import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const allowedTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);
const maxUploadBytes = 10 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: "Cloudinary environment variables are missing." }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = String(formData.get("folder") || "crm-documents").replace(/[^a-z0-9-_]/gi, "-");

    if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: "Only JPG, JPEG, PNG and PDF files are allowed." }, { status: 400 });
    }
    if (file.size > maxUploadBytes) {
      return NextResponse.json({ error: "Maximum upload size is 10MB." }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          use_filename: true,
          unique_filename: true,
          overwrite: false,
          transformation: file.type.startsWith("image/")
            ? [{ quality: "auto:good", fetch_format: "auto" }]
            : undefined
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      bytes: result.bytes,
      format: result.format
    });
  } catch {
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
