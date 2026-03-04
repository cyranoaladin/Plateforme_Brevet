import { NextResponse } from "next/server";
import { RetrievalService } from "@/services/aria/retrieval";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const chunks = await RetrievalService.hybridRetrieval(query);
    return NextResponse.json({ chunks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
