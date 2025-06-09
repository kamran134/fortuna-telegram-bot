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
}).then(() => {
    console.log('Webhook set successfully:', webhookUrl);
}).catch(error => {
    console.error('Failed to set webhook:', error);
});

const server = https.createServer({
    key: fs.readFileSync('/root/key.pem'),
    cert: fs.readFileSync('/root/cert.pem'),
}, (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            bot.processUpdate(JSON.parse(body));
            res.writeHead(200);
            res.end();
        } catch (error) {
            console.error('Error processing webhook update:', error);
            res.writeHead(500);
            res.end();
        }
    });
});

server.listen(8443);

setInterval(async () => {
    try {
        const webhookInfo = await bot.getWebhookInfo();
        console.log('Webhook status:', webhookInfo);
        if (!webhookInfo.url) {
            console.log('Webhook not set, registering...');
            await bot.setWebHook('https://42n.space:8443/bot' + token, {
                certificate: fs.readFileSync('/root/cert.pem'),
            });
        }
    } catch (error) {
        console.error('Webhook check failed:', error);
    }
}, 300000); // Проверять каждые 5 минут

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