import { privateMessage } from "../events/inlineQuery.js";

export async function sayPrivateButton(query, bot) {
    // const [fromId, toId, rawMsg] = query.data.split('_').slice(1);
    // const fromUserId = query.from.id;
    const fromUser = query.from;
    const hash = query.data.split('_')[1];

    const msgData = privateMessage[hash];

    if (!msgData) {
        return bot.answerCallbackQuery({
            callback_query_id: query.id,
            text: '❌ Ошибка: Сообщение не найдено.',
            show_alert: true
        });
    }

    const { from, to, message } = msgData;

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

    // const privateMsg = decodeURIComponent(rawMsg);

    /*
    try {
        const normalizedFromUserId = String(fromUserId).trim();
        const normalizedToId = String(toId).trim();
        const normalizedFromId = String(fromId).trim();

        if (normalizedFromUserId === normalizedToId ||
            normalizedFromUserId === normalizedFromId) {
            await bot.answerCallbackQuery({
                callback_query_id: query.id,
                text: `Это сообщение для ${fromId}: ${privateMsg}`,
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
    catch (error) {
        console.error('Error in sayPrivateButton:', error);
        try {
            await bot.answerCallbackQuery({
                callback_query_id: query.id,
                text: '❌ Произошла ошибка при обработке.',
                show_alert: true
            });
        } catch (innerError) {
            console.error('Ошибка при отправке answerCallbackQuery:', innerError);
        }
    }
    */
}