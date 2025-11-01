import ngrok from '@ngrok/ngrok';
import { loadEnv, createServer } from 'vite';
import { execSync } from 'child_process';

try {
	execSync('pkill -f ngrok', { stdio: 'ignore' });
} catch {}

const env = loadEnv('development', process.cwd(), '');

const TOKEN = env.VITE_GROK_TOKEN;
const PORT = Number(env.VITE_GROK_TOKEN) || 3000;

if (!TOKEN) {
	console.error('Missing VITE_GROK_TOKEN in .env file');
	process.exit(1);
}

console.log('Starting Vite server...');
const vite = await createServer({
	configFile: './vite.config.js',
});
await vite.listen(PORT);

console.log('Vite server running at http://localhost:3000');

await ngrok.authtoken(TOKEN);
const listener = await ngrok.forward({ addr: PORT });
console.log(`Ngrok tunnel started: ${listener.url()}`);

process.on('SIGINT', async () => {
	console.log('Stopping ngrok...');
	await listener.close();
	process.exit(0);
});
