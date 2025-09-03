"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineQuery = void 0;
const database_1 = require("../database");
const sayPrivateRedis_1 = require("../redis/sayPrivateRedis");
const inlineQuery = async (query, bot) => {
    const fromUser = query.from;
    const queryText = query.query;
    const parts = queryText.trim().split(' ');
    if (parts.length < 3 || !parts[0] || parts[0].toLowerCase() !== 'sayprivate') {
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
    if (!target) {
        return bot.answerInlineQuery(query.id, [{
                type: 'article',
                id: 'notarget',
                title: '❌ Цель не указана',
                input_message_content: {
                    message_text: '❌ Ошибка: Не указан получатель сообщения.'
                },
                description: 'Укажите @username получателя',
            }]);
    }
    const privateMsg = parts.slice(2).join(' ');
    let targetId = null;
    try {
        const targetUser = await (0, database_1.getUserByUsernameFromDatabase)(target.slice(1));
        if (targetUser) {
            targetId = targetUser.user_id;
        }
    }
    catch (e) {
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
    if (!targetId) {
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
    const hash = await (0, sayPrivateRedis_1.storePrivateMessage)(fromUser.id, targetId, privateMsg);
    const callbackData = `showPrivate_${hash}`;
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
};
exports.inlineQuery = inlineQuery;
//# sourceMappingURL=inlineQuery.js.map