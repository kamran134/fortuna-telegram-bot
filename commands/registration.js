const moment = require('moment');
const { addUserToDatabase, getUsersFromDatabase } = require('../database');

async function register(msg, bot) {
    const chatId = msg.chat.id;

    try {
        await addUserToDatabase(msg);
        bot.sendMessage(chatId, "Siz uğurla botda qeydiyyatdan keçdiniz / Вы успешно зарегистрировались в боте");
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
            const usersString = command === 'tag' ? tagRegistered(users) : listRegistered(users);
            bot.sendMessage(chatId, 'Зарегистрированные участники:\n\n' + usersString);
        }
    } catch (error) {
        console.error('REGISTERED ERROR', error);
    }
}

function tagRegistered(users) {
    return Array.isArray(users) ? users.map(user => user.username ? `@${user.username}` :
        `<a href="tg://user?id=${user.user_id}">${user.first_name}</a>`).join('\n') : '';
}

function listRegistered(users) {
    return users.map((user, index) => `${(index + 1)}. ${user.username} — ${user.first_name} ${user.last_name}`).join('\n');
}

module.exports = {
    register,
    getRegistered
}