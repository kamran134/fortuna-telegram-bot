import { CallbackQuery } from 'node-telegram-bot-api';
// import { privateMessage } from "../events/inlineQuery.js";
import { getPrivateMessage } from "../redis/sayPrivateRedis.js";

export async function sayPrivateButton(query: CallbackQuery, bot: any): Promise<void> {
    // const [fromId, toId, rawMsg] = query.data.split('_').slice(1);
    // const fromUserId = query.from.id;
    const hash = query.data?.split('_')[1];
    
    if (!hash) return;

    const data = await getPrivateMessage(hash);
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
