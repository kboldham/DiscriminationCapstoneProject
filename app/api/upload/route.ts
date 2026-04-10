import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { authOptions } from "@/lib/auth";

const ALLOWED_EXTENSIONS = new Set(["pdf", "jpg", "jpeg", "png", "gif", "webp"]);
const ALLOWED_MIME_TYPES  = new Set(["application/pdf", "image/jpeg", "image/png", "image/gif", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File exceeds the 10 MB size limit." }, { status: 400 });
  }

  // MIME type check
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: "File type not allowed. Accepted: PDF, JPG, PNG, GIF, WEBP." }, { status: 400 });
  }

  // Extension check — use basename to strip any path components (prevents path traversal)
  const safeName  = path.basename(file.name);
  const ext       = safeName.split(".").pop()?.toLowerCase() ?? "";
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json({ error: "File extension not allowed." }, { status: 400 });
  }

  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const uniqueName = `${Date.now()}-${safeName.replace(/\s/g, "_")}`;
  const filePath   = path.join(uploadDir, uniqueName);
  await writeFile(filePath, buffer);

  return NextResponse.json({
    fileName: file.name,
    fileUrl:  `/uploads/${uniqueName}`,
    fileType: file.type,
  });
}