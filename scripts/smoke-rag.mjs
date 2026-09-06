import { spawn, execSync } from 'child_process';
import waitOn from 'wait-on';
import fs from 'fs';

const PORT = process.env.PORT || 3010;
const URL = `http://localhost:${PORT}/api/health`;
const SEED_URL = `http://localhost:${PORT}/api/aria/debug/seed`;
const QUERY_URL = `http://localhost:${PORT}/api/mentor/query`;

console.log(`🚀 Starting RAG E2E smoke test...`);

let nextProcess;
let devProcess;

// `spawn(..., { shell: true })` returns a handle to the shell process only;
// `next dev`/`next start` run underneath it as further descendants (and
// Next.js's own dev-mode architecture spawns a persistent "next-server"
// worker that outlives its immediate parent). child.kill() only signals
// that top shell process, so it never reached those descendants - they
// kept listening on PORT forever after this script exited, breaking the
// *next* invocation (and `npm run dev`) with EADDRINUSE. `detached: true`
// below makes each child the leader of its own process group; killing the
// negative pid signals that whole group instead of just the shell.
function killProcessTree(child) {
  if (!child || child.killed) return;
  try {
    if (process.platform === 'win32') {
      child.kill();
    } else {
      process.kill(-child.pid, 'SIGTERM');
    }
  } catch {
    // Process group already gone - nothing to clean up.
  }
}

async function runTest() {
  try {
    // 1. Démarrer Qdrant uniquement.
    // Explicitly scoped to the "qdrant" service: an unqualified
    // `docker compose up -d` also (re)creates the "app" service, which
    // publishes host port 3010 - the exact port this script's own `next
    // dev`/`next start` servers bind to below - causing the dev server to
    // fail to bind and/or the health-wait to hit the wrong (production)
    // container. docker-compose.override.yml additionally publishes
    // Qdrant on 127.0.0.1:6333 for this host-side wait/query to reach it.
    console.log('📦 Starting Qdrant via docker compose...');
    execSync('docker compose up -d qdrant', { stdio: 'inherit' });

    console.log('⏳ Waiting for Qdrant to be ready...');
    await waitOn({
      resources: ['http-get://localhost:6333/collections'],
      timeout: 30000,
    });
    console.log('✅ Qdrant is ready.');

    // 2. Démarrer Next.js en mode dev pour le seed
    console.log('🌱 Starting Next.js in dev mode for seeding...');
    try { fs.unlinkSync('.next/dev/lock'); } catch (e) {}
    devProcess = spawn('npx', ['next', 'dev', '-p', PORT.toString()], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'development',
        ARIA_MODE: 'rag',
        QDRANT_URL: 'http://localhost:6333'
      },
      shell: true,
      detached: process.platform !== 'win32'
    });

    await waitOn({
      resources: [URL],
      timeout: 30000,
    });

    console.log(`💉 Seeding chunks via ${SEED_URL}...`);
    const seedResponse = await fetch(SEED_URL, { method: 'POST' });
    if (!seedResponse.ok) {
      throw new Error(`Seed failed with status ${seedResponse.status}`);
    }
    const seedData = await seedResponse.json();
    console.log(`✅ Seeding successful: ${seedData.count} chunks inserted.`);

    console.log('🛑 Stopping dev server...');
    killProcessTree(devProcess);
    devProcess = undefined; // already stopped: the `finally` block below must not kill it twice
    await new Promise(r => setTimeout(r, 2000)); // wait for it to die

    // 3. Build Next.js
    console.log('🏗️ Building Next.js...');
    execSync('npm run build', {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        SALT: 'prod-salt-min-32-chars-xxxxxxxxxxxxxxxx',
        NEXTAUTH_SECRET: 'prod-nextauth-secret-min-32-chars-xxxxx',
        ARIA_MODE: 'rag',
        QDRANT_URL: 'http://localhost:6333'
      }
    });

    // 4. Démarrer Next.js en production
    console.log(`🚀 Starting Next.js in production mode on port ${PORT}...`);
    nextProcess = spawn('npx', ['next', 'start', '-p', PORT.toString()], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        SALT: 'prod-salt-min-32-chars-xxxxxxxxxxxxxxxx',
        NEXTAUTH_SECRET: 'prod-nextauth-secret-min-32-chars-xxxxx',
        ARIA_MODE: 'rag',
        QDRANT_URL: 'http://localhost:6333'
      },
      shell: true,
      detached: process.platform !== 'win32'
    });

    await waitOn({
      resources: [URL],
      timeout: 30000,
    });
    console.log('✅ Production server is ready.');

    // 5. Query
    console.log(`🧠 Querying Mentor ARIA via ${QUERY_URL}...`);
    const queryResponse = await fetch(QUERY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: "Qu'est-ce que le théorème de Thalès ?",
        context: { subject: "maths" },
        studentProfile: {
          rank: "Apprenti",
          mastery: 50,
          bloomLevel: "N2"
        }
      })
    });

    if (!queryResponse.ok) {
      throw new Error(`Query failed with status ${queryResponse.status}`);
    }

    const data = await queryResponse.json();
    
    console.log("------------------------------------------");
    console.log("🤖 Mentor Answer Preview:");
    console.log(data.answerMarkdown?.substring(0, 150) + "...");
    console.log("------------------------------------------");
    
    // Assertions
    if (!data.citations || data.citations.length === 0) {
      throw new Error("Assertion failed: citations.length >= 1");
    }
    if (!data.citations[0].source) {
      throw new Error("Assertion failed: citations[0].source is empty");
    }

    console.log(`✅ Success! Found ${data.citations.length} valid citations.`);
    data.citations.forEach((c, i) => {
      console.log(`   [${i+1}] Source: ${c.source}`);
    });

    process.exitCode = 0;
  } catch (err) {
    console.error("❌ Smoke test failed:", err.message);
    process.exitCode = 1;
  } finally {
    console.log('🧹 Cleaning up...');
    // Both child processes MUST be reachable here, not just declared inside
    // the try block: if anything throws between spawning devProcess and its
    // explicit kill() above (a failed seed request, a timed-out waitOn,
    // ...), the previous version of this script leaked the dev server
    // indefinitely - it kept holding port 3010, so every following
    // invocation's `next dev`/`next start` silently failed to bind
    // (EADDRINUSE) while the script carried on talking to that stale
    // leftover server instead of failing loudly.
    killProcessTree(devProcess);
    killProcessTree(nextProcess);
    try {
      execSync('docker compose down', { stdio: 'inherit' });
    } catch(e) {}
  }
}

runTest();
