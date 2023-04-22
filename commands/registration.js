const moment = require('moment');
const { addUserToDatabase, getUsersFromDatabase } = require('../database');

async function register(msg, bot) {
    try {
        await addUserToDatabase(msg);
        bot.sendMessage(msg.chat.id, "Siz uğurla botda qeydiyyatdan keçdiniz / Вы успешно зарегистрировались в боте");
    } catch (error) {
        console.error('Inserting error', error);
    }
}

async function getRegistered(msg, bot, command) {
    try {
        const users = await getUsersFromDatabase(msg);
        if (!users) {
            bot.sendMessage(msg.from.id, 'Произошла ошибка. Читай логи');
        } else if (users.length === 0) {
            bot.sendMessage(msg.chat.id, 'Нет зарегистрированных пользователей. Капец!');
        } else {
            console.log(JSON.stringify(users));
            const usersString = command === 'tag' ? getRegistered(users) : listRegistered(users);
            bot.sendMessage(msg.chat.id, 'Зарегистрированные участники:\n\n' + usersString);
        }
    } catch (error) {
        console.error('REGISTERED ERROR', error);
    }
}

function getRegistered(users) {
    console.log('users', JSON.stringify(users));
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