import fs from 'fs';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { LOG_LEVEL, LOG_DIR, APP_ENV } from '../config';

if (!fs.existsSync(LOG_DIR)) {
	fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logFormat = format.printf(({ level, message, timestamp, stack, ...meta }) => {
	const base = `${timestamp} [${level}] ${stack || message}`;
	const metaKeys = Object.keys(meta);
	if (metaKeys.length) return base + ' ' + JSON.stringify(meta);
	return base;
});

const logger = createLogger({
	level: LOG_LEVEL,
	format: format.combine(
		format.errors({ stack: true }),
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
		format.splat(),
		format.json(),
		logFormat
	),
	defaultMeta: { env: APP_ENV },
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize({ all: true }),
				format.timestamp({ format: 'HH:mm:ss' }),
				format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
			)
		}),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		new (transports as any).DailyRotateFile({
			dirname: LOG_DIR,
			filename: 'app-%DATE%.log',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d'
		})
	],
	exitOnError: false,
});

export default logger;
