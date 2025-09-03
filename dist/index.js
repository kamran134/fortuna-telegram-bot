"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_telegram_bot_api_1 = tslib_1.__importDefault(require("node-telegram-bot-api"));
const onMessage_1 = require("./events/onMessage");
const callbackQuery_1 = require("./events/callbackQuery");
const newChatMembers_1 = require("./events/newChatMembers");
const leftChatMember_1 = require("./events/leftChatMember");
const inlineQuery_1 = require("./events/inlineQuery");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
// Устанавливаем токен, который вы получили от BotFather
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    throw new Error('TELEGRAM_TOKEN is not defined in environment variables');
}
const webhookUrl = 'https://42n.space:8443/bot' + token;
// Создаем экземпляр бота
const bot = new node_telegram_bot_api_1.default(token);
bot.on('new_chat_members', async (msg) => {
    await (0, newChatMembers_1.newChatMembers)(msg, bot);
});
bot.on('left_chat_member', async (msg) => {
    await (0, leftChatMember_1.leftChatMember)(msg, bot);
});
// Слушаем сообщения
bot.on('message', async (msg) => {
    await (0, onMessage_1.onMessage)(msg, bot);
});
bot.on('callback_query', async (query) => {
    await (0, callbackQuery_1.callbackQuery)(query, bot);
});
bot.on('inline_query', async (query) => {
    await (0, inlineQuery_1.inlineQuery)(query, bot);
});
//# sourceMappingURL=index.js.map