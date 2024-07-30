const moment = require("moment");
const { startGame } = require("../commands");
const { deactiveGameInDatabase, getGamesFromDatabase, getGamePlayersFromDataBase } = require("../database");
const { tagUsersByCommas } = require("../commands/common");
const { skloneniye } = require("../common/skloneniye");

async function deactiveGame(query, bot) {
    const gameId = query.data.split('_')[1];
    const chatId = query.message.chat.id;

    try {
        const label = await deactiveGameInDatabase(gameId);

        if (label) {
            bot.sendMessage(chatId, `Игра на ${skloneniye(label, 'винительный')} закрыта!`);
        } else {
            bot.sendMessage(chatId, 'Кажется, такой игры больше нет');
        }
    } catch (error) {
        console.error('DEACTIVE GAME ERROR: ', error);
    }
}

async function startGameInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    bot.sendMessage(adminChatId, 'Введите параметры игры в следующем формате: дата игры (ДД.ММ.ГГГГ)/время начала игры (чч:мм)/время окончания игры (чч:мм)/количество мест/место проведения/название игры');

    let waitForInput = true;

    bot.on('message', async (msg) => {
        try {
            if (!waitForInput) {
                return;
            }
            
            if (msg.text === '/cancel' && msg.chat.id === adminChatId) {
                waitForInput = false;
                bot.sendMessage(adminChatId, 'Создание игры отменено!');                
                return;
            }

            // Проверяем, что сообщение пользователя соответствует нужному формату
            const regex = /^(\d{2}\.\d{2}\.\d{4})\/(\d{2}:\d{2})\/(\d{2}:\d{2})\/(\d+)\/([^\/]+)\/([^\/]+)$/;
            const match = msg.text.match(regex);

            // Если сообщение не соответствует формату, то отправляем пользователю сообщение об ошибке и ждем следующее сообщение от него
            if (msg.chat.id === adminChatId) {
                if (!match) {
                    await bot.sendMessage(adminChatId, 'Формат неверный');
                } else {
                    waitForInput = false;
                    await startGame({...msg, chat: {...msg.chat, id: selectedGroupChatId}}, bot);
                }
            }
        } catch (error) {
            console.error('CREATE GAME ERROR: ', error);
            bot.sendMessage(adminChatId, 'Произошла ошибка при создании игры');
        }
    });
}

async function showGamesInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    let gameDeactiveButtons = [];

    try {
        const games = await getGamesFromDatabase(selectedGroupChatId);

        if (games && games.length > 0) {
            const gamesString = games.map((game, index) =>
                `Игра №${(index + 1)}\n` +
                `    🗓Дата: ${moment(game.game_date).format('DD.MM.YYYY')} (${game.label})\n`
            ).join('\n----------------------------------\n');

            gameDeactiveButtons = games.map(game => ({
                text: `Закрыть игру на ${skloneniye(game.label, 'винительный')} (для админов)`,
                callback_data: `deactivegame_${game.id}`}));

            bot.sendMessage(adminChatId, gamesString, {
                reply_markup: {
                    inline_keyboard: [gameDeactiveButtons]
                }
            });
        } else {
            bot.sendMessage(adminChatId, 'Ты не можешь деактивировать игру, если активных игр нет');
        }
    } catch (error) {
        console.error('DEACTIVE GAME ERROR', error);
    }
}

async function tagGamePlayersInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    bot.sendMessage(adminChatId, 'Введите ваше послание игрокам!');
    let waitForInput = true;

    bot.on('message', async (msg) => {
        try {
            if (!waitForInput) {
                return;
            }
            
            if (msg.text === '/cancel' && msg.chat.id === adminChatId) {
                waitForInput = false;
                bot.sendMessage(adminChatId, 'Послание отменено!');                
                return;
            }

            // Если сообщение не соответствует формату, то отправляем пользователю сообщение об ошибке и ждем следующее сообщение от него
            if (msg.chat.id === adminChatId) {
                try {
                    const gamePlayers = await getGamePlayersFromDataBase(selectedGroupChatId);
                    resultMessage = tagUsersByCommas(gamePlayers) + ', ' + msg.text;
                    waitForInput = false;
                    bot.sendMessage(selectedGroupChatId, resultMessage, {parse_mode: 'HTML'});
                    return;
                } catch (error) {
                    console.error('GET GAMERS ERROR: ', error);
                }
            }
        } catch (error) {
            console.error('CREATE GAME ERROR: ', error);
            bot.sendMessage(adminChatId, 'Произошла ошибка при создании игры');
        }
    });
}

async function showPayListInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    try {
        const gamePlayers = await getGamePlayersFromDataBase(selectedGroupChatId);

        if (!gamePlayers || gamePlayers.length === 0) {
            bot.sendMessage(adminChatId, `Нет записавшихся на игру. Капец.`);
        } else {
            let i = 1;

            gamePlayers.forEach(gamePlayer => {
                if (!usersByGame[gamePlayer.game_id]) {
                    i = 1;
                    usersByGame[gamePlayer.game_id] = {
                        users: [{
                            ind: i, last_name: gamePlayer.last_name, first_name: gamePlayer.first_name, 
                            username: gamePlayer.username, confirmed_attendance: gamePlayer.confirmed_attendance
                        }],
                        game_date: gamePlayer.game_date,
                        game_label: gamePlayer.label,
                        users_limit: gamePlayer.users_limit
                    };
                } else usersByGame[gamePlayer.game_id] = {
                    users: [...usersByGame[gamePlayer.game_id].users, {ind: i, last_name: gamePlayer.last_name,
                        first_name: gamePlayer.first_name, username: gamePlayer.username, confirmed_attendance: gamePlayer.confirmed_attendance}
                    ],
                    game_date: gamePlayer.game_date,
                    game_label: gamePlayer.label,
                    users_limit: gamePlayer.users_limit
                };
    
                i++;
            });

            for (const game_id of Object.keys(usersByGame)) {
                if (!game_id) return;

                const placeLeft = usersByGame[game_id].users_limit - usersByGame[game_id].users.length;
                const gameUsersLimit = usersByGame[game_id].users_limit;

                const users = usersByGame[game_id].users.map(
                    user => `${user.ind === (gameUsersLimit + 1) ? '\n--------------Wait list--------------\n' : ''}${user.ind}. ${user.first_name} ${user.last_name}${user.payed ? '✅ заплатил' : '❌ НЕ заплатил'}`).join('\n');
                const message = `Игра на ${skloneniye(usersByGame[game_id].game_label, 'винительный')}. ${moment(usersByGame[game_id].game_date).format("DD.MM.YYYY")}:\n\n` +
                                `Участники:\n${users}\n\n` +
                                `Осталось мест: ${(placeLeft >= 0 ? placeLeft : 0)}`;

                resultMessage.push(message);
            }

            bot.sendMessage(adminChatId, resultMessage.join('\n\n————————————————————————————————\n————————————————————————————————\n\n'));
        }
    } catch (error) {
        console.error("Get pay list error: ", error);
    }
}

module.exports = {
    deactiveGame,
    startGameInSelectedGroup,
    showGamesInSelectedGroup,
    tagGamePlayersInSelectedGroup
}