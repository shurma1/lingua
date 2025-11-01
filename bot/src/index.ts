import { bot } from './Init/index.js';
import { TextHandler, WebAppHandler } from './Handlers/index.js';

bot.on('message', WebAppHandler);
bot.on('text', TextHandler);
