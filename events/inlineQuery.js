import { getUserByUsernameFromDatabase } from "../database/index.js";

export const inlineQuery = async (query, bot) => {

    console.log('INLINE QUERY: ', query);

    const fromUser = query.from;
    const queryText = query.query;

    const parts = queryText.trim().split(' ');

    if (parts.length < 3 || parts[0].toLowerCase() !== 'sayprivate') {
        return bot.answerInlineQuery(query.id, [{
            type: 'article',
            id: 'help',
            title: 'Использование',
            input_message_content: {
                message_text: '❌ Использование: @botusername sayprivate @username сообщение'
            },
            description: 'Например: @bot sayprivate @user Привет!',
        }]);
    }

    const target = parts[1];
    const privateMsg = parts.slice(2).join(' ');

    let targetId = null;

    try {
        const targetUser = await getUserByUsernameFromDatabase(target);
        targetId = targetUser.id;
    } catch (e) {
        return bot.answerInlineQuery(query.id, [{
            type: 'article',
            id: 'notfound',
            title: '❌ Пользователь не найден',
            input_message_content: {
                message_text: '❌ Ошибка: Не удалось найти пользователя.'
            },
            description: 'Убедитесь, что @username указан правильно',
        }]);
    }

    const callbackData = `showPrivate_${fromUser.id}_${targetId}_${encodeURIComponent(privateMsg)}`;

    const result = {
        type: 'article',
        id: 'private_msg',
        title: `Отправить приватное сообщение для ${target}`,
        input_message_content: {
            message_text: `🔐 Приватное сообщение для ${target}`,
        },
        reply_markup: {
            inline_keyboard: [[
                { text: '🔐 Посмотреть', callback_data: callbackData }
            ]]
        },
        description: privateMsg,
    };

    bot.answerInlineQuery(query.id, [result], { cache_time: 0 });
}