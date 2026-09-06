import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";

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

  // 2. Qdrant check, gated on the validated ARIA_MODE (not raw env vars:
  // QDRANT_URL always has a default per src/config/env.ts, so reading
  // process.env.QDRANT_URL directly would never be falsy and this check
  // would incorrectly run - or skip - independently of what
  // VectorStoreService actually does). Uses /readyz, matching the contract
  // documented in docs/RELEASE_CHECKLIST.md ("Ping .../readyz -> 'all
  // good'"): /healthz only reports the process is alive, while /readyz
  // reflects that Qdrant's shards have finished loading/recovering and it
  // can actually serve requests.
  if (env.ARIA_MODE === "rag") {
    try {
      const res = await fetch(`${env.QDRANT_URL}/readyz`, { signal: AbortSignal.timeout(env.QDRANT_TIMEOUT_MS) });
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
