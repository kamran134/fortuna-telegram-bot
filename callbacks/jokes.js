export async function sayPrivateButton(query, bot) {
    // const callbackData = 'showPrivate_' + userId + '_' + targetId + '_' + encodeURIComponent(privateMsg);
    const [fromId, toId, privateMsg] = query.data.split('_').slice(1);
    const chatId = query.message.chat.id;
    const fromUserId = query.from.id;

    try {
        if (fromUserId === toId || fromUserId === fromId) {
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
}