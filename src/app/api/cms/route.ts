import { NextResponse } from "next/server";
import { publishSnapshot, readDraftSnapshot, readPublishedSnapshot, readRevisions, saveDraftSnapshot } from "@/content/github";
import { validateSnapshot } from "@/content/validate";
import type { PortfolioSnapshot } from "@/content/schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const mode = new URL(request.url).searchParams.get("mode");
    if (mode === "draft") return NextResponse.json(await readDraftSnapshot());
    if (mode === "revisions") return NextResponse.json(await readRevisions());
    return NextResponse.json(await readPublishedSnapshot());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "콘텐츠를 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const snapshot = await request.json() as PortfolioSnapshot;
    validateSnapshot(snapshot);
    await saveDraftSnapshot(snapshot);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Draft 저장에 실패했습니다." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const snapshot = await request.json() as PortfolioSnapshot;
    validateSnapshot(snapshot);
    await saveDraftSnapshot(snapshot, "Save publish candidate");
    return NextResponse.json(await publishSnapshot(snapshot));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Publish에 실패했습니다." }, { status: 400 });
  }
}
