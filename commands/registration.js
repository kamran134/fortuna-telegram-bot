import { addUserToDatabase, getUsersFromDatabase, getJokeFromDataBase, removeUserFromDatabase } from '../database/index.js';
import { tagUsers, listUsers } from './common.js';
import { JokeTypes } from '../common/jokeTypes.js';

export async function register(chatAndUser, bot) {
    const { chatId } = chatAndUser;
    try {
        const result = await addUserToDatabase(chatAndUser);
        bot.sendMessage(chatId, result);
    } catch (error) {
        console.error('REGISTRATION ERROR: ', error);
    }
}

export async function getRegistered(msg, bot, command, isAdmin) {
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

export async function unregister(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try {
        await removeUserFromDatabase(chatId, userId);
        bot.sendMessage(chatId, "✅ Siz uğurla sistemdən qeydiyyatdan çıxardınız / Вы успешно удалены из системы");
    } catch (error) {
        console.error('UNREGISTRATION ERROR: ', error);
    }
}