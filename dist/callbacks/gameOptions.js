"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactiveGame = deactiveGame;
exports.startGameInSelectedGroup = startGameInSelectedGroup;
exports.showGamesInSelectedGroup = showGamesInSelectedGroup;
exports.tagGamePlayersInSelectedGroup = tagGamePlayersInSelectedGroup;
exports.showPayListInSelectedGroup = showPayListInSelectedGroup;
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const commands_1 = require("../commands");
const database_1 = require("../database");
const common_1 = require("../commands/common");
const skloneniye_1 = require("../common/skloneniye");
const jokeTypes_1 = require("../common/jokeTypes");
async function deactiveGame(query, bot, isAdmin) {
    const gameIdStr = query.data?.split('_')[1];
    const chatId = query.message?.chat.id;
    const { id, first_name } = query.from;
    if (!gameIdStr || !chatId)
        return;
    const gameId = parseInt(gameIdStr);
    if (isNaN(gameId))
        return;
    if (isAdmin) {
        try {
            const label = await (0, database_1.deactiveGameInDatabase)(gameId);
            if (label) {
                bot.sendMessage(chatId, `Игра на ${(0, skloneniye_1.skloneniye)(label, 'винительный')} закрыта!`);
            }
            else {
                bot.sendMessage(chatId, 'Кажется, такой игры больше нет');
            }
        }
        catch (error) {
            console.error('DEACTIVE GAME ERROR: ', error);
        }
    }
    else {
        try {
            let joke = await (0, database_1.getJokeFromDataBase)(jokeTypes_1.JokeTypes.DEACTIVE_GAME);
            joke = joke.replace('[name]', `<a href="tg://user?id=${id}">${first_name}</a>`);
            bot.sendMessage(chatId, `Только одмэн может закрыть игру. ${joke}`, {
                parse_mode: 'HTML',
                reply_to_message_id: query.message?.message_id
            });
        }
        catch (error) {
            console.error('DEACTIVE FOR NON ADMIN ERROR: ', error);
        }
    }
}
async function startGameInSelectedGroup(query, bot) {
    const adminChatId = query.message?.chat.id;
    const selectedGroupChatIdStr = query.data?.split('_')[1];
    if (!adminChatId || !selectedGroupChatIdStr)
        return;
    const selectedGroupChatId = parseInt(selectedGroupChatIdStr);
    if (isNaN(selectedGroupChatId))
        return;
    bot.sendMessage(adminChatId, 'Введите параметры игры в следующем формате: дата игры (ДД.ММ.ГГГГ)/время начала игры (чч:мм)/время окончания игры (чч:мм)/количество мест/место проведения/название игры');
    let waitForInput = true;
    const messageHandler = async (msg) => {
        try {
            if (!waitForInput) {
                return;
            }
            if (msg.text === '/cancel' && msg.chat.id === adminChatId) {
                waitForInput = false;
                bot.removeListener('message', messageHandler);
                bot.sendMessage(adminChatId, 'Создание игры отменено!');
                return;
            }
            // Проверяем, что сообщение пользователя соответствует нужному формату
            const regex = /^(\d{2}\.\d{2}\.\d{4})\/(\d{2}:\d{2})\/(\d{2}:\d{2})\/(\d+)\/([^\/]+)\/([^\/]+)$/;
            const match = msg.text?.match(regex);
            // Если сообщение не соответствует формату, то отправляем пользователю сообщение об ошибке и ждем следующее сообщение от него
            if (msg.chat.id === adminChatId) {
                if (!match) {
                    await bot.sendMessage(adminChatId, 'Формат неверный');
                }
                else {
                    waitForInput = false;
                    bot.removeListener('message', messageHandler);
                    await (0, commands_1.startGame)({ ...msg, chat: { ...msg.chat, id: selectedGroupChatId } }, bot);
                }
            }
        }
        catch (error) {
            console.error('CREATE GAME ERROR: ', error);
            bot.sendMessage(adminChatId, 'Произошла ошибка при создании игры');
        }
    };
    bot.on('message', messageHandler);
}
async function showGamesInSelectedGroup(query, bot) {
    const adminChatId = query.message?.chat.id;
    const selectedGroupChatIdStr = query.data?.split('_')[1];
    if (!adminChatId || !selectedGroupChatIdStr)
        return;
    const selectedGroupChatId = parseInt(selectedGroupChatIdStr);
    if (isNaN(selectedGroupChatId))
        return;
    let gameDeactiveButtons = [];
    try {
        const games = await (0, database_1.getGamesFromDatabase)(selectedGroupChatId);
        if (games && games.length > 0) {
            const gamesString = games.map((game, index) => `Игра №${(index + 1)}\n` +
                `    🗓Дата: ${(0, moment_1.default)(game.game_date).format('DD.MM.YYYY')} (${game.label})\n`).join('\n----------------------------------\n');
            gameDeactiveButtons = games.map((game) => ({
                text: `Закрыть игру на ${(0, skloneniye_1.skloneniye)(game.label, 'винительный')} (для админов)`,
                callback_data: `deactivegame_${game.id}`
            }));
            bot.sendMessage(adminChatId, gamesString, {
                reply_markup: {
                    inline_keyboard: [gameDeactiveButtons]
                }
            });
        }
        else {
            bot.sendMessage(adminChatId, 'Ты не можешь деактивировать игру, если активных игр нет');
        }
    }
    catch (error) {
        console.error('DEACTIVE GAME ERROR', error);
    }
}
async function tagGamePlayersInSelectedGroup(query, bot) {
    const adminChatId = query.message?.chat.id;
    const selectedGroupChatIdStr = query.data?.split('_')[1];
    if (!adminChatId || !selectedGroupChatIdStr)
        return;
    const selectedGroupChatId = parseInt(selectedGroupChatIdStr);
    if (isNaN(selectedGroupChatId))
        return;
    bot.sendMessage(adminChatId, 'Введите ваше послание игрокам!');
    let waitForInput = true;
    const messageHandler = async (msg) => {
        try {
            if (!waitForInput) {
                return;
            }
            if (msg.text === '/cancel' && msg.chat.id === adminChatId) {
                waitForInput = false;
                bot.removeListener('message', messageHandler);
                bot.sendMessage(adminChatId, 'Послание отменено!');
                return;
            }
            // Если сообщение от админа
            if (msg.chat.id === adminChatId) {
                try {
                    const gamePlayers = await (0, database_1.getGamePlayersFromDataBase)(selectedGroupChatId);
                    const resultMessage = (0, common_1.tagUsersByCommas)(gamePlayers) + ', ' + msg.text;
                    waitForInput = false;
                    bot.removeListener('message', messageHandler);
                    bot.sendMessage(selectedGroupChatId, resultMessage, { parse_mode: 'HTML' });
                    return;
                }
                catch (error) {
                    console.error('GET GAMERS ERROR: ', error);
                }
            }
        }
        catch (error) {
            console.error('TAG GAMERS ERROR: ', error);
            bot.sendMessage(adminChatId, 'Произошла ошибка при отправке сообщения');
        }
    };
    bot.on('message', messageHandler);
}
async function showPayListInSelectedGroup(query, bot) {
    const adminChatId = query.message?.chat.id;
    const selectedGroupChatIdStr = query.data?.split('_')[1];
    if (!adminChatId || !selectedGroupChatIdStr)
        return;
    const selectedGroupChatId = parseInt(selectedGroupChatIdStr);
    if (isNaN(selectedGroupChatId))
        return;
    try {
        const gamePlayers = await (0, database_1.getGamePlayersFromDataBase)(selectedGroupChatId);
        if (!gamePlayers || gamePlayers.length === 0) {
            bot.sendMessage(adminChatId, `Нет записавшихся на игру. Капец.`);
        }
        else {
            const usersByGame = {};
            const resultMessage = [];
            let i = 1;
            gamePlayers.forEach((gamePlayer) => {
                if (!usersByGame[gamePlayer.game_id]) {
                    i = 1;
                    usersByGame[gamePlayer.game_id] = {
                        users: [{
                                ind: i,
                                last_name: gamePlayer.last_name,
                                first_name: gamePlayer.first_name,
                                username: gamePlayer.username,
                                confirmed_attendance: gamePlayer.confirmed_attendance,
                                payed: gamePlayer.payed
                            }],
                        game_date: gamePlayer.game_date,
                        game_label: gamePlayer.label,
                        users_limit: gamePlayer.users_limit
                    };
                }
                else {
                    usersByGame[gamePlayer.game_id] = {
                        users: [...usersByGame[gamePlayer.game_id].users, {
                                ind: i,
                                last_name: gamePlayer.last_name,
                                first_name: gamePlayer.first_name,
                                username: gamePlayer.username,
                                confirmed_attendance: gamePlayer.confirmed_attendance,
                                payed: gamePlayer.payed
                            }],
                        game_date: gamePlayer.game_date,
                        game_label: gamePlayer.label,
                        users_limit: gamePlayer.users_limit
                    };
                }
                i++;
            });
            for (const game_id of Object.keys(usersByGame)) {
                if (!game_id)
                    return;
                const placeLeft = usersByGame[game_id].users_limit - usersByGame[game_id].users.length;
                const gameUsersLimit = usersByGame[game_id].users_limit;
                const users = usersByGame[game_id].users.map((user) => `${user.ind === (gameUsersLimit + 1) ? '\n--------------Wait list--------------\n' : ''}${user.ind}. ${user.first_name} ${user.last_name}${user.payed ? '✅ заплатил' : '❌ НЕ заплатил'}`).join('\n');
                const message = `Игра на ${(0, skloneniye_1.skloneniye)(usersByGame[game_id].game_label, 'винительный')}. ${(0, moment_1.default)(usersByGame[game_id].game_date).format("DD.MM.YYYY")}:\n\n` +
                    `Участники:\n${users}\n\n` +
                    `Осталось мест: ${(placeLeft >= 0 ? placeLeft : 0)}`;
                resultMessage.push(message);
            }
            bot.sendMessage(adminChatId, resultMessage.join('\n\n————————————————————————————————\n————————————————————————————————\n\n'));
        }
    }
    catch (error) {
        console.error("Get pay list error: ", error);
    }
}
//# sourceMappingURL=gameOptions.js.map