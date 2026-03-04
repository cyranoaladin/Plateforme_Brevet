import { spawn } from 'child_process';
import waitOn from 'wait-on';

const PORT = process.env.PORT || 3000;
const SALT = process.env.SALT || "dev-salt-min-32-chars-xxxxxxxxxxxxxxxx";
const URL = `http://localhost:${PORT}/api/health`;

console.log(`🚀 Starting production smoke test on port ${PORT}...`);

// Démarrage du serveur Next.js
const child = spawn('npx', ['next', 'start', '-p', PORT.toString()], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    SALT: SALT
  },
  shell: true // Important pour la compatibilité npx sous Windows
});

let success = false;

async function runTest() {
  try {
    // Attente de l'endpoint de santé
    console.log(`⏳ Waiting for ${URL}...`);
    await waitOn({
      resources: [URL],
      timeout: 30000,
    });

    // Validation finale via fetch
    const response = await fetch(URL);
    const data = await response.json();

    if (response.ok && data.status === 'UP' && data.environment === 'production') {
      console.log('✅ Production health check passed!');
      success = true;
    } else {
      console.error('❌ Production health check failed:', data);
    }
  } catch (err) {
    console.error('❌ Smoke test error:', err.message);
  } finally {
    console.log('🛑 Cleaning up server...');
    child.kill();
    // Forcer l'arrêt pour certains OS récalcitrants
    process.exit(success ? 0 : 1);
  }
}

runTest();
