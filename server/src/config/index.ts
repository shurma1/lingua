import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';


const NODE_ENV_PRE = process.env.NODE_ENV || 'development';
const envFilesOrder = [
	'.env',
	'.env.local',
	`.env.${NODE_ENV_PRE}`,
	`.env.${NODE_ENV_PRE}.local`,
];

for (const file of envFilesOrder) {
	const full = path.resolve(process.cwd(), file);
	if (fs.existsSync(full)) {
		dotenv.config({ path: full });
	}
}

function env(name: string, def?: string): string {
	const v = process.env[name];
	if (v === undefined || v === '') return def as string;
	return v;
}

export const APP_ENV = env('NODE_ENV', 'development');
const rawPort = env('PORT', '3000');
export const PORT = parseInt(rawPort, 10);
if (Number.isNaN(PORT)) {
	console.warn('[config] Invalid PORT value, fallback to 3000');
}
export const LOG_LEVEL = env('LOG_LEVEL', APP_ENV === 'production' ? 'info' : 'debug');
export const LOG_DIR = env('LOG_DIR', path.resolve(process.cwd(), 'logs'));
export const TTS_MODEL = env('TTS_MODEL', 'onnx-community/Kokoro-82M-ONNX');
export const TTS_DTYPE = env('TTS_DTYPE', 'q8');

// JWT & Auth
export const JWT_SECRET = env('JWT_SECRET', 'secret-key');
export const JWT_EXPIRES_IN = env('JWT_EXPIRES_IN', '7d');
export const JWT_REFRESH_SECRET = env('JWT_REFRESH_SECRET', 'secret-key-refresh');
export const JWT_REFRESH_EXPIRES_IN = env('JWT_REFRESH_EXPIRES_IN', '30d');
export const BOT_TOKEN = env('BOT_TOKEN', '');

// Quest scoring
export const QUEST_BASE_STARS = parseInt(env('QUEST_BASE_STARS', '10'), 10);
export const QUEST_BASE_EXP = parseInt(env('QUEST_BASE_EXP', '50'), 10);
export const DUEL_WINNER_STARS = parseInt(env('DUEL_WINNER_STARS', '20'), 10);
export const DUEL_WINNER_EXP = parseInt(env('DUEL_WINNER_EXP', '100'), 10);

export const config = {
	env: APP_ENV,
	port: PORT,
	log: {
		level: LOG_LEVEL,
		dir: LOG_DIR,
	},
	tts: {
		model: TTS_MODEL,
		dtype: TTS_DTYPE,
	},
	auth: {
		jwtSecret: JWT_SECRET,
		jwtExpiresIn: JWT_EXPIRES_IN,
		jwtRefreshSecret: JWT_REFRESH_SECRET,
		jwtRefreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
		botToken: BOT_TOKEN,
	},
	scoring: {
		questBaseStars: QUEST_BASE_STARS,
		questBaseExp: QUEST_BASE_EXP,
		duelWinnerStars: DUEL_WINNER_STARS,
		duelWinnerExp: DUEL_WINNER_EXP,
	},
};

export default config;
