import TelegramBot from 'node-telegram-bot-api';
import { BOT_API_KEY } from '../../config.js';

if (!BOT_API_KEY) {
  throw new Error('BOT_API_KEY is not configured.');
}

const bot = new TelegramBot(BOT_API_KEY, {
  polling: {
    interval: 300,
    autoStart: true
  }
});

export { bot };
