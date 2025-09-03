import { Message } from 'node-telegram-bot-api';
import { addUserToDatabase, getUsersFromDatabase, getJokeFromDataBase, removeUserFromDatabase } from '../database';
import { tagUsers, listUsers } from './common';
import { JokeTypes } from '../common/jokeTypes';
import { User } from '../models/User';

interface ChatAndUser {
    chatId: number;
    user: User;
}

export async function register(chatAndUser: ChatAndUser, bot: any): Promise<void> {
    const { chatId } = chatAndUser;
    try {
        const result = await addUserToDatabase(chatAndUser);
        bot.sendMessage(chatId, result);
    } catch (error) {
        console.error('REGISTRATION ERROR: ', error);
    }
}

export async function getRegistered(msg: Message, bot: any, command: 'tag' | 'show', isAdmin: boolean): Promise<void> {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;

    if (!userId) return;

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
    } else {
        try {
            const joke = await getJokeFromDataBase(JokeTypes.TAG_REGISTERED);
            bot.sendMessage(chatId, `Только одмэн может массово беспокоить всех! ${joke}`);
        } catch (error) {
            console.error('REGISTERED NON ADMIN ERROR: ', error);
        }
    }
}

export async function unregister(msg: Message, bot: any): Promise<void> {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;

    if (!userId) return;

    try {
        await removeUserFromDatabase(chatId, userId);
        bot.sendMessage(chatId, "✅ Siz uğurla sistemdən qeydiyyatdan çıxardınız / Вы успешно удалены из системы");
    } catch (error) {
        console.error('UNREGISTRATION ERROR: ', error);
    }
} 