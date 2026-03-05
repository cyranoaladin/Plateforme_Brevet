import { NextResponse } from "next/server";
import { RetrievalService } from "@/services/aria/retrieval";
import { env } from "@/config/env";

export async function POST(request: Request) {
  if (env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  try {
    const { query } = await request.json();
    const chunks = await RetrievalService.hybridRetrieval(query);
    return NextResponse.json({ chunks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
