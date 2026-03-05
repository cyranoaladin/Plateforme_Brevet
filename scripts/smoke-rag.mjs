import { spawn, execSync } from 'child_process';
import waitOn from 'wait-on';
import fs from 'fs';

const PORT = process.env.PORT || 3010;
const URL = `http://localhost:${PORT}/api/health`;
const SEED_URL = `http://localhost:${PORT}/api/aria/debug/seed`;
const QUERY_URL = `http://localhost:${PORT}/api/mentor/query`;

console.log(`🚀 Starting RAG E2E smoke test...`);

let nextProcess;

async function runTest() {
  try {
    // 1. Démarrer Qdrant
    console.log('📦 Starting Qdrant via docker compose...');
    execSync('docker compose up -d', { stdio: 'inherit' });

    console.log('⏳ Waiting for Qdrant to be ready...');
    await waitOn({
      resources: ['http-get://localhost:6333/collections'],
      timeout: 30000,
    });
    console.log('✅ Qdrant is ready.');

    // 2. Démarrer Next.js en mode dev pour le seed
    console.log('🌱 Starting Next.js in dev mode for seeding...');
    try { fs.unlinkSync('.next/dev/lock'); } catch (e) {}
    const devProcess = spawn('npx', ['next', 'dev', '-p', PORT.toString()], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'development',
        ARIA_MODE: 'rag',
        QDRANT_URL: 'http://localhost:6333'
      },
      shell: true
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
    devProcess.kill();
    await new Promise(r => setTimeout(r, 2000)); // wait for it to die

    // 3. Build Next.js
    console.log('🏗️ Building Next.js...');
    execSync('npm run build', {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        SALT: 'prod-salt-min-32-chars-xxxxxxxxxxxxxxxx',
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
        ARIA_MODE: 'rag',
        QDRANT_URL: 'http://localhost:6333'
      },
      shell: true
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
    if (nextProcess) nextProcess.kill();
    try {
      execSync('docker compose down', { stdio: 'inherit' });
    } catch(e) {}
  }
}

runTest();
