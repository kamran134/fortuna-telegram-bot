import TelegramBot from 'node-telegram-bot-api';
import { onMessage } from './events/onMessage';
import { callbackQuery } from './events/callbackQuery';
import { newChatMembers } from './events/newChatMembers';
import { leftChatMember } from './events/leftChatMember';
import { inlineQuery } from './events/inlineQuery';
import dotenv from 'dotenv';

dotenv.config();

// Устанавливаем токен, который вы получили от BotFather
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    throw new Error('TELEGRAM_TOKEN is not defined in environment variables');
}

const webhookUrl = 'https://42n.space:8443/bot' + token;

// Создаем экземпляр бота
const bot = new TelegramBot(token);

bot.on('new_chat_members', async (msg) => {
    await newChatMembers(msg, bot);
});

bot.on('left_chat_member', async (msg) => {
    await leftChatMember(msg, bot);
});

// Слушаем сообщения
bot.on('message', async (msg) => {
    await onMessage(msg, bot);
});

bot.on('callback_query', async (query) => {
    await callbackQuery(query, bot);
});

bot.on('inline_query', async (query) => {
    await inlineQuery(query, bot);
}); 