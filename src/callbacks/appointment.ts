import { CallbackQuery } from 'node-telegram-bot-api';
import { addGamePlayerByIdToDatabase, removeGamePlayerByIdFromDatabase, checkGameStatusFromDatabase, getJokeFromDataBase } from '../database/index.js';
import { JokeTypes } from '../common/jokeTypes.js';
import { skloneniye } from '../common/skloneniye.js';

export async function appointmentToTheGame(query: CallbackQuery, bot: any): Promise<void> {
    const chatId = query.message?.chat.id;
    const user = query.from;
    const gameIdStr = query.data?.replace('appointment_', '');

    if (!chatId || !gameIdStr) return;

    const gameId = parseInt(gameIdStr);
    if (isNaN(gameId)) return;

    try {
        const examStatus = await checkGameStatusFromDatabase(gameId);

        if (examStatus) {
            const gameLabel = await addGamePlayerByIdToDatabase({ gameId, chatId, userId: user.id, confirmed_attendance: true });

            if (!gameLabel) {
                bot.sendMessage(chatId, `Пока вы записывались, игра отменилась кажется. Во всяком случае нет такой игры 🫣`);
                return;
            } else {
                bot.sendMessage(chatId, `@${user.username} вы записались на ${skloneniye(gameLabel, 'винительный')}!`)
            }
        }
        else {
            bot.sendMessage(chatId, `@${user.username} куда ты прёшь? Игра закрыта!`)
        }
    } catch (error) {
        console.error('APPOINTMENT ERROR: ', error);
    }
}

export async function notConfirmedAttendance(query: CallbackQuery, bot: any): Promise<void> {
    const chatId = query.message?.chat.id;
    const user = query.from;
    const gameIdStr = query.data?.replace('notconfirmed_', '');
    
    if (!chatId || !gameIdStr) return;

    const gameId = parseInt(gameIdStr);
    if (isNaN(gameId)) return;

    try {
        const gameLabel = await addGamePlayerByIdToDatabase({ gameId, chatId, userId: user.id, confirmed_attendance: false });

        if (!gameLabel) {
            bot.sendMessage(chatId, `Пока вы записывались, игра отменилась кажется. Во всяком случае нет такой игры 🫣`);
            return;
        } else {
            bot.sendMessage(chatId, `@${user.username} вы записались на ${skloneniye(gameLabel, 'винительный')}! Но это не точно 😒`);
        }
    } catch (error) {
        console.error('NOT CONFIRMED ATTENDANCE ERROR: ', error);
    }
}

export async function declineAppointment(query: CallbackQuery, bot: any): Promise<void> {
    const chatId = query.message?.chat.id;
    const user = query.from;
    const gameIdStr = query.data?.replace('decline_', '');

    if (!chatId || !gameIdStr) return;

    const gameId = parseInt(gameIdStr);
    if (isNaN(gameId)) return;

    try {
        const gameLabel = await removeGamePlayerByIdFromDatabase({ gameId, chatId, userId: user.id });

        if (gameLabel) {
            const joke = await getJokeFromDataBase(JokeTypes.LEFT_GAME);

            bot.sendMessage(chatId, `@${user.username} удирает с игры на ${skloneniye(gameLabel, 'винительный')}. ${joke}`);
        } else {
            bot.sendMessage(chatId, `@${user.username} минусует 🥲`);
        }
    } catch (error) {
        console.error('DECLINE APPOINTMENT ERROR: ', error);
    }
}

export async function privateAppointmentToTheGame(query: CallbackQuery, bot: any): Promise<void> {
    const chatIdStr = query.data?.split('_')[1];
    const gameIdStr = query.data?.split('_')[2];
    const user = query.from;
    
    if (!chatIdStr || !gameIdStr) return;

    const chatId = parseInt(chatIdStr);
    const gameId = parseInt(gameIdStr);
    if (isNaN(chatId) || isNaN(gameId)) return;

    try {
        const examStatus = await checkGameStatusFromDatabase(gameId);

        if (examStatus) {
            const gameLabel = await addGamePlayerByIdToDatabase({ gameId, chatId, userId: user.id, confirmed_attendance: true });

            if (!gameLabel) {
                bot.sendMessage(chatId, `Пока вы записывались, игра отменилась кажется. Во всяком случае нет такой игры 🫣`);
                return;
            } else {
                bot.sendMessage(chatId, `@${user.username} вы записались на ${skloneniye(gameLabel, 'винительный')}!`)
            }
        }
        else {
            bot.sendMessage(chatId, `@${user.username} куда ты прёшь? Игра закрыта!`)
        }
    } catch (error) {
        console.error('APPOINTMENT ERROR: ', error);
    }
}

export async function privateNotConfirmedAttendance(query: CallbackQuery, bot: any): Promise<void> {
    const chatIdStr = query.data?.split('_')[1];
    const gameIdStr = query.data?.split('_')[2];
    const user = query.from;
    
    if (!chatIdStr || !gameIdStr) return;

    const chatId = parseInt(chatIdStr);
    const gameId = parseInt(gameIdStr);
    if (isNaN(chatId) || isNaN(gameId)) return;

    try {
        const gameLabel = await addGamePlayerByIdToDatabase({ gameId, chatId, userId: user.id, confirmed_attendance: false });

        if (!gameLabel) {
            bot.sendMessage(chatId, `Пока вы записывались, игра отменилась кажется. Во всяком случае нет такой игры 🫣`);
            return;
        } else {
            bot.sendMessage(chatId, `@${user.username} вы записались на ${skloneniye(gameLabel, 'винительный')}! Но это не точно 😒`);
        }
    } catch (error) {
        console.error('NOT CONFIRMED ATTENDANCE ERROR: ', error);
    }
}

export async function privateDeclineAppointment(query: CallbackQuery, bot: any): Promise<void> {
    const chatIdStr = query.data?.split('_')[1];
    const gameIdStr = query.data?.split('_')[2];
    const user = query.from;

    if (!chatIdStr || !gameIdStr) return;

    const chatId = parseInt(chatIdStr);
    const gameId = parseInt(gameIdStr);
    if (isNaN(chatId) || isNaN(gameId)) return;

    try {
        const gameLabel = await removeGamePlayerByIdFromDatabase({ gameId, chatId, userId: user.id });

        if (gameLabel) {
            bot.sendMessage(chatId, `@${user.username} удирает с игры на ${skloneniye(gameLabel, 'винительный')}. Бейте предателя! 😡`);
        } else {
            bot.sendMessage(chatId, `@${user.username} минусует 🥲`);
        }
    } catch (error) {
        console.error('DECLINE APPOINTMENT ERROR: ', error);
    }
}
