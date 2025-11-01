import type TelegramBot from 'node-telegram-bot-api';
import { WEB_APP_URL } from '../../config.js';

const OpenWebAppKeyboard: TelegramBot.SendMessageOptions = {
  reply_markup: {
    keyboard: [
      [
        {
          text: 'Now in cinema📽️',
          web_app: {
            url: WEB_APP_URL
          }
        }
      ]
    ],
    resize_keyboard: true
  }
};

export { OpenWebAppKeyboard };
