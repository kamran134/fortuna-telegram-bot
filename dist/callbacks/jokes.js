"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sayPrivateButton = sayPrivateButton;
// import { privateMessage } from "../events/inlineQuery";
const sayPrivateRedis_1 = require("../redis/sayPrivateRedis");
async function sayPrivateButton(query, bot) {
    // const [fromId, toId, rawMsg] = query.data.split('_').slice(1);
    // const fromUserId = query.from.id;
    const hash = query.data?.split('_')[1];
    if (!hash)
        return;
    const data = await (0, sayPrivateRedis_1.getPrivateMessage)(hash);
    //const msgData = privateMessage[hash];
    if (!data) {
        return bot.answerCallbackQuery({
            callback_query_id: query.id,
            text: '❌ Ошибка: Сообщение не найдено.',
            show_alert: true
        });
    }
    const { from, to, message } = data;
    const fromUser = query.from;
    if (fromUser.id === +from || fromUser.id === +to) {
        await bot.answerCallbackQuery({
            callback_query_id: query.id,
            text: `🔐 Сообщение: ${message}`,
            show_alert: true,
        });
    }
    else {
        await bot.answerCallbackQuery({
            callback_query_id: query.id,
            text: 'Это сообщение не для тебя 🙅‍♂️',
            show_alert: true,
        });
    }
}
//# sourceMappingURL=jokes.js.map