import { NextResponse } from "next/server";
import { uploadImage } from "@/content/github";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) throw new Error("이미지 파일을 선택하세요.");
    if (!file.type.startsWith("image/")) throw new Error("이미지 파일만 업로드할 수 있습니다.");
    if (file.size > 10 * 1024 * 1024) throw new Error("이미지는 10MB 이하여야 합니다.");
    return NextResponse.json(await uploadImage(file));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다." }, { status: 400 });
  }
}
