import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, string> = {};
  let isReady = true;

  // 1. Database check (SQLite via Prisma)
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "UP";
  } catch {
    checks.database = "DOWN";
    isReady = false;
  }

  // 2. Qdrant check if configured
  const qdrantUrl = process.env.QDRANT_URL;
  if (qdrantUrl && process.env.ARIA_MODE !== "mock") {
    try {
      const res = await fetch(`${qdrantUrl}/healthz`, { signal: AbortSignal.timeout(2000) });
      checks.qdrant = res.ok ? "UP" : "DOWN";
      if (!res.ok) isReady = false;
    } catch {
      checks.qdrant = "DOWN";
      isReady = false;
    }
  } else {
    checks.qdrant = "MOCK_OR_BYPASS";
  }

  const status = isReady ? 200 : 503;
  return NextResponse.json(
    {
      status: isReady ? "READY" : "NOT_READY",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status }
  );
}
