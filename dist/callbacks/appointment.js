"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentToTheGame = appointmentToTheGame;
exports.notConfirmedAttendance = notConfirmedAttendance;
exports.declineAppointment = declineAppointment;
exports.privateAppointmentToTheGame = privateAppointmentToTheGame;
exports.privateNotConfirmedAttendance = privateNotConfirmedAttendance;
exports.privateDeclineAppointment = privateDeclineAppointment;
const database_1 = require("../database");
const jokeTypes_1 = require("../common/jokeTypes");
const skloneniye_1 = require("../common/skloneniye");
async function appointmentToTheGame(query, bot) {
    const chatId = query.message?.chat.id;
    const user = query.from;
    const gameIdStr = query.data?.replace('appointment_', '');
    if (!chatId || !gameIdStr)
        return;
    const gameId = parseInt(gameIdStr);
    if (isNaN(gameId))
        return;
    try {
        const examStatus = await (0, database_1.checkGameStatusFromDatabase)(gameId);
        if (examStatus) {
            const gameLabel = await (0, database_1.addGamePlayerByIdToDatabase)({ gameId, chatId, userId: user.id, confirmed_attendance: true });
            if (!gameLabel) {
                bot.sendMessage(chatId, `Пока вы записывались, игра отменилась кажется. Во всяком случае нет такой игры 🫣`);
                return;
            }
            else {
                bot.sendMessage(chatId, `@${user.username} вы записались на ${(0, skloneniye_1.skloneniye)(gameLabel, 'винительный')}!`);
            }
        }
        else {
            bot.sendMessage(chatId, `@${user.username} куда ты прёшь? Игра закрыта!`);
        }
    }
    catch (error) {
        console.error('APPOINTMENT ERROR: ', error);
    }
}
async function notConfirmedAttendance(query, bot) {
    const chatId = query.message?.chat.id;
    const user = query.from;
    const gameIdStr = query.data?.replace('notconfirmed_', '');
    if (!chatId || !gameIdStr)
        return;
    const gameId = parseInt(gameIdStr);
    if (isNaN(gameId))
        return;
    try {
        const gameLabel = await (0, database_1.addGamePlayerByIdToDatabase)({ gameId, chatId, userId: user.id, confirmed_attendance: false });
        if (!gameLabel) {
            bot.sendMessage(chatId, `Пока вы записывались, игра отменилась кажется. Во всяком случае нет такой игры 🫣`);
            return;
        }
        else {
            bot.sendMessage(chatId, `@${user.username} вы записались на ${(0, skloneniye_1.skloneniye)(gameLabel, 'винительный')}! Но это не точно 😒`);
        }
    }
    catch (error) {
        console.error('NOT CONFIRMED ATTENDANCE ERROR: ', error);
    }
}
async function declineAppointment(query, bot) {
    const chatId = query.message?.chat.id;
    const user = query.from;
    const gameIdStr = query.data?.replace('decline_', '');
    if (!chatId || !gameIdStr)
        return;
    const gameId = parseInt(gameIdStr);
    if (isNaN(gameId))
        return;
    try {
        const gameLabel = await (0, database_1.removeGamePlayerByIdFromDatabase)({ gameId, chatId, userId: user.id });
        if (gameLabel) {
            const joke = await (0, database_1.getJokeFromDataBase)(jokeTypes_1.JokeTypes.LEFT_GAME);
            bot.sendMessage(chatId, `@${user.username} удирает с игры на ${(0, skloneniye_1.skloneniye)(gameLabel, 'винительный')}. ${joke}`);
        }
        else {
            bot.sendMessage(chatId, `@${user.username} минусует 🥲`);
        }
    }
    catch (error) {
        console.error('DECLINE APPOINTMENT ERROR: ', error);
    }
}
async function privateAppointmentToTheGame(query, bot) {
    const chatIdStr = query.data?.split('_')[1];
    const gameIdStr = query.data?.split('_')[2];
    const user = query.from;
    if (!chatIdStr || !gameIdStr)
        return;
    const chatId = parseInt(chatIdStr);
    const gameId = parseInt(gameIdStr);
    if (isNaN(chatId) || isNaN(gameId))
        return;
    try {
        const examStatus = await (0, database_1.checkGameStatusFromDatabase)(gameId);
        if (examStatus) {
            const gameLabel = await (0, database_1.addGamePlayerByIdToDatabase)({ gameId, chatId, userId: user.id, confirmed_attendance: true });
            if (!gameLabel) {
                bot.sendMessage(chatId, `Пока вы записывались, игра отменилась кажется. Во всяком случае нет такой игры 🫣`);
                return;
            }
            else {
                bot.sendMessage(chatId, `@${user.username} вы записались на ${(0, skloneniye_1.skloneniye)(gameLabel, 'винительный')}!`);
            }
        }
        else {
            bot.sendMessage(chatId, `@${user.username} куда ты прёшь? Игра закрыта!`);
        }
    }
    catch (error) {
        console.error('APPOINTMENT ERROR: ', error);
    }
}
async function privateNotConfirmedAttendance(query, bot) {
    const chatIdStr = query.data?.split('_')[1];
    const gameIdStr = query.data?.split('_')[2];
    const user = query.from;
    if (!chatIdStr || !gameIdStr)
        return;
    const chatId = parseInt(chatIdStr);
    const gameId = parseInt(gameIdStr);
    if (isNaN(chatId) || isNaN(gameId))
        return;
    try {
        const gameLabel = await (0, database_1.addGamePlayerByIdToDatabase)({ gameId, chatId, userId: user.id, confirmed_attendance: false });
        if (!gameLabel) {
            bot.sendMessage(chatId, `Пока вы записывались, игра отменилась кажется. Во всяком случае нет такой игры 🫣`);
            return;
        }
        else {
            bot.sendMessage(chatId, `@${user.username} вы записались на ${(0, skloneniye_1.skloneniye)(gameLabel, 'винительный')}! Но это не точно 😒`);
        }
    }
    catch (error) {
        console.error('NOT CONFIRMED ATTENDANCE ERROR: ', error);
    }
}
async function privateDeclineAppointment(query, bot) {
    const chatIdStr = query.data?.split('_')[1];
    const gameIdStr = query.data?.split('_')[2];
    const user = query.from;
    if (!chatIdStr || !gameIdStr)
        return;
    const chatId = parseInt(chatIdStr);
    const gameId = parseInt(gameIdStr);
    if (isNaN(chatId) || isNaN(gameId))
        return;
    try {
        const gameLabel = await (0, database_1.removeGamePlayerByIdFromDatabase)({ gameId, chatId, userId: user.id });
        if (gameLabel) {
            bot.sendMessage(chatId, `@${user.username} удирает с игры на ${(0, skloneniye_1.skloneniye)(gameLabel, 'винительный')}. Бейте предателя! 😡`);
        }
        else {
            bot.sendMessage(chatId, `@${user.username} минусует 🥲`);
        }
    }
    catch (error) {
        console.error('DECLINE APPOINTMENT ERROR: ', error);
    }
}
//# sourceMappingURL=appointment.js.map