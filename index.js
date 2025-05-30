import TelegramBot from 'node-telegram-bot-api';
import { onMessage } from './events/onMessage.js';
import { callbackQuery } from './events/callbackQuery.js';
import { newChatMembers } from './events/newChatMembers.js';
import { leftChatMember } from './events/leftChatMember.js';
import { inlineQuery } from './events/inlineQuery.js';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

dotenv.config();

// Устанавливаем токен, который вы получили от BotFather
const token = process.env.TELEGRAM_TOKEN;
const webhookUrl = 'https://42n.space:8443/bot' + token;

// Создаем экземпляр бота
//const bot = new TelegramBot(token, { polling: true });
const bot = new TelegramBot(token);

bot.setWebHook(webhookUrl, {
    certificate: fs.readFileSync('/root/cert.pem'),
});

const server = https.createServer({
    key: fs.readFileSync('/root/key.pem'),
    cert: fs.readFileSync('/root/cert.pem'),
}, (req, res) => {
    bot.processUpdate(JSON.parse(req.body));
    res.writeHead(200);
    res.end();
});

server.listen(8443);

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