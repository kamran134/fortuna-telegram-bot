const { addUserToDatabase, getUsersFromDatabase } = require('../database');
const { tagUsers, listUsers } = require('./common');

async function register(msg, bot) {
    const chatId = msg.chat.id;

    try {
        await addUserToDatabase(msg);
        bot.sendMessage(chatId, "✅ Siz uğurla sistemdə qeydiyyatdan keçdiniz / Вы успешно зарегистрировались в системе");
    } catch (error) {
        console.error('REGISTRATION ERROR: ', error);
    }
}

async function getRegistered(msg, bot, command) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try {
        const users = await getUsersFromDatabase(chatId);
        
        if (!users) {
            bot.sendMessage(userId, 'Произошла ошибка. Читай логи!');
        } else if (users.length === 0) {
            bot.sendMessage(chatId, 'Нет зарегистрированных пользователей. Капец!');
        } else {
            const usersString = command === 'tag' ? tagUsers(users) : listUsers(users);
            bot.sendMessage(chatId, 'Qeydiyyatdan keçmiş iştirakçılar\nЗарегистрированные участники:\n\n' + usersString, {parse_mode: 'HTML'});
        }
    } catch (error) {
        console.error('REGISTERED ERROR', error);
    }
}

module.exports = {
    register,
    getRegistered
}