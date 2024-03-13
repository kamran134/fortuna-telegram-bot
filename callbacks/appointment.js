const moment = require('moment');
const { addGamePlayerByIdToDatabase, removeGamePlayerByIdFromDatabase, checkGameStatusFromDatabase } = require('../database');
const { skloneniye } = require('../common/skloneniye');

async function appointmentToTheGame(query, bot) {
    const chatId = query.message.chat.id;
    const user = query.from;
    const gameId = query.data.replace('appointment_', '');

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

async function notConfirmedAttendance(query, bot) {
    const chatId = query.message.chat.id;
    const user = query.from;
    const gameId = query.data.replace('notconfirmed_', '');
    
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

async function declineAppointment(query, bot) {
    const chatId = query.message.chat.id;
    const user = query.from;
    const gameId = query.data.replace('decline_', '');

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

module.exports = {
    appointmentToTheGame,
    notConfirmedAttendance,
    declineAppointment
}