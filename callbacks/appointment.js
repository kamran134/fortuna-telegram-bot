const moment = require('moment');
const { addGamePlayerByIdToDatabase, removeGamePlayerByIdFromDatabase } = require('../database');

async function appointmentToTheGame(query, bot) {
    const chatId = query.message.chat.id;
    const user = query.from;
    const gameId = query.data.replace('appointment_', '');

    try {
        const gameLabel = await addGamePlayerByIdToDatabase({ gameId, chatId, userId: user.id, exactly: true });

        if (!gameLabel) {
            bot.sendMessage(chatId, `Пока вы записывались, игра отменилась кажется. Во всяком случае нет такой игры 🫣`);
            return;
        } else {
            bot.sendMessage(chatId, `@${user.username} вы записались на ${gameLabel}!`)
        }
    } catch (error) {
        console.error('APPOINTMENT ERROR: ', error);
    }
}

async function notExactlyAppointment(query, bot) {
    const chatId = query.message.chat.id;
    const user = query.from;
    const gameId = query.data.replace('notexactly_', '');
    
    try {
        const gameLabel = await addGamePlayerByIdToDatabase({ gameId, chatId, userId: user.id, exactly: false });

        if (!gameLabel) {
            bot.sendMessage(chatId, `Пока вы записывались, игра отменилась кажется. Во всяком случае нет такой игры 🫣`);
            return;
        } else {
            bot.sendMessage(chatId, `@${user.username} вы записались на ${gameLabel}! Но это не точно 😒`);
        }
    } catch (error) {
        console.error('APPOINTMENT NOT EXACTLY ERROR: ', error);
    }
}

async function declineAppointment(query, bot) {
    const chatId = query.message.chat.id;
    const user = query.from;
    const gameId = query.data.replace('decline_', '');

    try {
        const gameLabel = await removeGamePlayerByIdFromDatabase({ gameId, chatId, userId: user.id });

        if (gameLabel) {
            bot.sendMessage(chatId, `@${user.username} удирает с игры на ${gameLabel}. Бейте предателя! 😡`);
        } else {
            bot.sendMessage(chatId, `@${user.username} минусует 🥲`);
        }
    } catch (error) {
        console.error('DECLINE APPOINTMENT ERROR: ', error);
    }
}

module.exports = {
    appointmentToTheGame,
    notExactlyAppointment,
    declineAppointment
}