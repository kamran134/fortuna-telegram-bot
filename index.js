// const TelegramBot = require('node-telegram-bot-api');
import TelegramBot from 'node-telegram-bot-api';
import { onMessage } from './events/onMessage.js';
import { callbackQuery } from './events/callbackQuery.js';
import { newChatMembers } from './events/newChatMembers.js';
import { leftChatMember } from './events/leftChatMember.js';
import dotenv from 'dotenv';

dotenv.config();

// const { onMessage } = require('./onMessage');
// const { callbackQuery } = require('./callbackQuery');
// const { newChatMembers } = require('./newChatMembers');
// const { leftChatMember } = require('./leftChatMember');

// Устанавливаем токен, который вы получили от BotFather
const token = process.env.TELEGRAM_TOKEN;

console.log(token);
// Проверяем, что токен существует

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

bot.on('new_chat_members', async (msg) => {
    newChatMembers(msg, bot);
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