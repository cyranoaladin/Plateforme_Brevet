import { spawn } from 'child_process';
import waitOn from 'wait-on';

const PORT = process.env.PORT || 3000;
const SALT = process.env.SALT || "dev-salt-min-32-chars-xxxxxxxxxxxxxxxx";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "dev-nextauth-secret-min-32-chars-xxxxx";
const HEALTH_URL = `http://localhost:${PORT}/api/health`;
const PROFILE_URL = `http://localhost:${PORT}/api/user/profile`;

console.log(`🚀 Starting production smoke test on port ${PORT}...`);

// Voir scripts/smoke-rag.mjs pour le détail : { shell: true } ne renvoie
// qu'un handle sur le process shell, pas sur `next start` lui-même (et ses
// éventuels enfants) ; killProcessTree() cible tout le groupe de process
// via son pid négatif plutôt que de fuiter un serveur sur PORT après coup.
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

// Démarrage du serveur Next.js
const child = spawn('npx', ['next', 'start', '-p', PORT.toString()], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    SALT: SALT,
    NEXTAUTH_SECRET: NEXTAUTH_SECRET
  },
  shell: true, // Important pour la compatibilité npx sous Windows
  detached: process.platform !== 'win32'
});

let success = false;

async function runTest() {
  try {
    // Attente de l'endpoint de santé
    console.log(`⏳ Waiting for ${HEALTH_URL}...`);
    await waitOn({
      resources: [HEALTH_URL],
      timeout: 30000,
    });

    // Validation finale via fetch
    const response = await fetch(HEALTH_URL);
    const data = await response.json();

    if (!(response.ok && data.status === 'UP' && data.environment === 'production')) {
      console.error('❌ Production health check failed:', data);
      return;
    }
    console.log('✅ Production health check passed!');

    // /api/health never imports src/config/env.ts, so it stays green even
    // when required production secrets (NEXTAUTH_SECRET, SALT) are
    // missing - NextAuth then throws a generic 500 "MissingSecretError" on
    // the very first authenticated request instead of a clean 401. Hitting
    // a real protected route here (unauthenticated) is what actually
    // proves the production auth configuration is complete.
    console.log(`🔒 Checking auth guard on ${PROFILE_URL} (expect 401, not 500)...`);
    const profileResponse = await fetch(PROFILE_URL);
    if (profileResponse.status !== 401) {
      console.error(`❌ Auth guard check failed: expected 401, got ${profileResponse.status}`);
      const body = await profileResponse.text();
      console.error('Response body:', body);
      return;
    }
    console.log('✅ Auth guard check passed (401 as expected).');

    success = true;
  } catch (err) {
    console.error('❌ Smoke test error:', err.message);
  } finally {
    console.log('🛑 Cleaning up server...');
    killProcessTree(child);
    // Forcer l'arrêt pour certains OS récalcitrants
    process.exit(success ? 0 : 1);
  }
}

runTest();
