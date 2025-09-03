"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.getRegistered = getRegistered;
exports.unregister = unregister;
const database_1 = require("../database");
const common_1 = require("./common");
const jokeTypes_1 = require("../common/jokeTypes");
async function register(chatAndUser, bot) {
    const { chatId } = chatAndUser;
    try {
        const result = await (0, database_1.addUserToDatabase)(chatAndUser);
        bot.sendMessage(chatId, result);
    }
    catch (error) {
        console.error('REGISTRATION ERROR: ', error);
    }
}
async function getRegistered(msg, bot, command, isAdmin) {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    if (!userId)
        return;
    if (isAdmin) {
        try {
            const users = await (0, database_1.getUsersFromDatabase)(chatId);
            if (!users) {
                bot.sendMessage(userId, 'Произошла ошибка. Читай логи!');
            }
            else if (users.length === 0) {
                bot.sendMessage(chatId, 'Нет зарегистрированных пользователей. Капец!');
            }
            else {
                const usersString = command === 'tag' ? (0, common_1.tagUsers)(users) : (0, common_1.listUsers)(users);
                bot.sendMessage(chatId, 'Qeydiyyatdan keçmiş iştirakçılar\nЗарегистрированные участники:\n\n' + usersString, { parse_mode: 'HTML' });
            }
        }
        catch (error) {
            console.error('REGISTERED ERROR: ', error);
        }
    }
    else {
        try {
            const joke = await (0, database_1.getJokeFromDataBase)(jokeTypes_1.JokeTypes.TAG_REGISTERED);
            bot.sendMessage(chatId, `Только одмэн может массово беспокоить всех! ${joke}`);
        }
        catch (error) {
            console.error('REGISTERED NON ADMIN ERROR: ', error);
        }
    }
}
async function unregister(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    if (!userId)
        return;
    try {
        await (0, database_1.removeUserFromDatabase)(chatId, userId);
        bot.sendMessage(chatId, "✅ Siz uğurla sistemdən qeydiyyatdan çıxardınız / Вы успешно удалены из системы");
    }
    catch (error) {
        console.error('UNREGISTRATION ERROR: ', error);
    }
}
//# sourceMappingURL=registration.js.map