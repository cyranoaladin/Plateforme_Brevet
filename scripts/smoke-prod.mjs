import { spawn, execSync } from 'child_process';
import waitOn from 'wait-on';
import nextEnv from '@next/env'; // CommonJS module: no named exports under Node's ESM loader
const { loadEnvConfig } = nextEnv;

const isWindows = process.platform === 'win32';

// This plain `node scripts/smoke-prod.mjs` process never gets Next.js's
// own .env-file loading for free - only `next dev`/`build`/`start`
// (spawned below as children) do that themselves. Without this, a
// developer who followed the documented `cp .env.example .env` setup and
// put NEXTAUTH_SECRET there would still see this script refuse to start:
// process.env.NEXTAUTH_SECRET would be unset in THIS process even though
// the child `next start` would have picked it up fine on its own. Uses
// Next's own loader (`@next/env`, a real dependency of `next` itself) so
// this follows exactly the same env files, in the same order, as the app.
loadEnvConfig(process.cwd());

const PORT = process.env.PORT || 3000;
const SALT = process.env.SALT || "dev-salt-min-32-chars-xxxxxxxxxxxxxxxx";
const HEALTH_URL = `http://localhost:${PORT}/api/health`;
const PROFILE_URL = `http://localhost:${PORT}/api/user/profile`;
const AUTH_PROBE_TIMEOUT_MS = 5000;

// Required, no fallback (unlike SALT above): the whole point of the auth
// probe below is to catch a missing NEXTAUTH_SECRET in whatever
// environment runs this script (CI, a deploy pipeline, an uninstrumented
// local .env, ...). Silently substituting a working value here - like
// SALT does, for convenience - would make that check permanently unable
// to fail, defeating its purpose.
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!NEXTAUTH_SECRET) {
  console.error('❌ NEXTAUTH_SECRET is not set. Refusing to run smoke:prod: the auth-guard check below only proves production auth is configured if this is genuinely provided by the caller, not defaulted here.');
  process.exit(1);
}

console.log(`🚀 Starting production smoke test on port ${PORT}...`);

// { shell: true } returns a handle to the shell process only; `next start`
// runs underneath it as a further descendant. child.kill() only signals
// that top shell process, so it can leave a server listening on PORT after
// this script exits. killProcessTree() targets the whole process group
// (POSIX) or process tree (Windows) instead.
function killProcessTree(child) {
  if (!child || child.killed) return;
  try {
    if (isWindows) {
      execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: 'ignore' });
    } else {
      process.kill(-child.pid, 'SIGTERM');
    }
  } catch {
    // Process (group) already gone - nothing to clean up.
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
  detached: !isWindows
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
    // proves the production auth configuration is complete. A timeout is
    // set explicitly so a hung route can't stop this script from ever
    // reaching its cleanup/exit below.
    console.log(`🔒 Checking auth guard on ${PROFILE_URL} (expect 401, not 500)...`);
    const profileResponse = await fetch(PROFILE_URL, { signal: AbortSignal.timeout(AUTH_PROBE_TIMEOUT_MS) });
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
