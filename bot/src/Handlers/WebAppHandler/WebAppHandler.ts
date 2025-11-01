import TelegramBot from 'node-telegram-bot-api';
import { bot } from '../../Init/index.js';

interface SeatDescriptor {
  rowMarker: string;
  seat: number;
}

interface WebAppPayload {
  title: string;
  time: string;
  seats: SeatDescriptor[];
  price: number;
}

const WebAppHandler = async (message: TelegramBot.Message): Promise<void> => {
  if (!message.chat || !message.web_app_data) {
    return;
  }

  try {
    const data = JSON.parse(message.web_app_data.data) as WebAppPayload;

    const places = data.seats.map((seat) => `${seat.rowMarker}${seat.seat}`).join(', ');
    const total = `$${(data.price * data.seats.length).toFixed(2)} (${data.seats.length}x$${data.price})`;

    const answer = [
      `<b>${data.title} movie tickets are booked</b>`,
      `<b>Your places:</b> ${places}`,
      `<b>Time:</b> ${data.time}`,
      `<b>total:</b> ${total}`
    ].join('\n');

    await bot.sendMessage(message.chat.id, answer, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Failed to process web app data', error);
  }
};

export { WebAppHandler };
