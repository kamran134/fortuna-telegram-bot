const { addUserToDatabase, getUsersFromDatabase, getJokeFromDataBase } = require('../database');
const { tagUsers, listUsers } = require('./common');
const { JokeTypes } = require('../common/jokeTypes');

async function register(msg, bot) {
    const chatId = msg.chat.id;

    try {
        await addUserToDatabase(msg);
        bot.sendMessage(chatId, "✅ Siz uğurla sistemdə qeydiyyatdan keçdiniz / Вы успешно зарегистрировались в системе");
    } catch (error) {
        console.error('REGISTRATION ERROR: ', error);
    }
}

async function getRegistered(msg, bot, command, isAdmin) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (isAdmin) {
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
            console.error('REGISTERED ERROR: ', error);
        }
    }
    else {
        try {
            const joke = await getJokeFromDataBase(JokeTypes.TAG_REGISTERED);

            bot.sendMessage(chatId, `Только одмэн может массово беспокоить всех! ${joke}`);
        }
        catch (error) {
            console.error('REGISTERED NON ADMIN ERROR: ', error)
        }
    }
    
}

module.exports = {
    register,
    getRegistered
}