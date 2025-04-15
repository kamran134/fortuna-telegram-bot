// const TelegramBot = require('node-telegram-bot-api');
import TelegramBot from 'node-telegram-bot-api';
import { onMessage } from './events/onMessage.js';
import { callbackQuery } from './events/callbackQuery.js';
import { newChatMembers } from './events/newChatMembers.js';
import { leftChatMember } from './events/leftChatMember.js';

// const { onMessage } = require('./onMessage');
// const { callbackQuery } = require('./callbackQuery');
// const { newChatMembers } = require('./newChatMembers');
// const { leftChatMember } = require('./leftChatMember');

// Устанавливаем токен, который вы получили от BotFather
const token = '5853539307:AAGIfxr3O_mu-uN07fqYCirWzxTHs-UqrJY';

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