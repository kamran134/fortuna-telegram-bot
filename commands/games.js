const moment = require('moment');
const { getUsersFromDatabase, addGameToDatabase, getGamesFromDatabase, changeGameLimitFromDataBase } = require('../database');
const { tagUsersByCommas } = require('./common');
const { Markup } = require('telegraf');
const { skloneniye } = require('../common/skloneniye')

async function startGame(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // Разбиваем текст команды на части
    const parts = msg.text.replace('/startgame ', '').split('/');
    
    // Если указаны все данные, сохраняем их
    if (parts.length === 6) {

        const gameOptions = {
            date: parts[0],
            start: parts[1],
            end: parts[2],
            users_limit: parts[3],
            location: parts[4],
            label: parts[5]
        }

        let taggedUsers = '';

        const users = await getUsersFromDatabase(chatId);

        if (users && users.length > 0) {
            //taggedUsers = tagUsersForGame(users);
            taggedUsers = tagUsersByCommas(users);

            try {
                const gameId = await addGameToDatabase(chatId, gameOptions);

                if (gameId && gameId > 0) {
                    bot.sendMessage(chatId, `Игра на ${skloneniye(gameOptions.label, 'винительный')} создана. ${gameOptions.date}\nс ${gameOptions.start} до ${gameOptions.end}.\n` +
                        `Место: ${gameOptions.location}\n\n${taggedUsers}`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {text: 'Oyuna yazılmaq / Записаться на игру', callback_data: `appointment_${gameId}`},
                                ],
                                [
                                    {text: 'Dəqiq deyil / Не точно', callback_data: `notconfirmed_${gameId}`},
                                ],
                                [
                                    {text: 'İmtina etmək / Отказаться от игры', callback_data: `decline_${gameId}`}
                                ]
                            ]
                        }
                    });

                users.forEach(user => {
                    bot.sendMessage(user.user_id, `Игра на ${skloneniye(gameOptions.label, 'винительный')} создана.\n` +
                        `Дата: ${gameOptions.date}\nВремя: с ${gameOptions.start} до ${gameOptions.end}.\n` +
                        `Место: ${gameOptions.location}`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {text: 'Oyuna yazılmaq / Записаться на игру', callback_data: `appointment_${gameId}`},
                                ],
                                [
                                    {text: 'Dəqiq deyil / Не точно', callback_data: `notconfirmed_${gameId}`},
                                ],
                                [
                                    {text: 'İmtina etmək / Отказаться от игры', callback_data: `decline_${gameId}`}
                                ]
                            ]
                        }
                    });
                });
                } else {
                    bot.sendMessage(userId, 'Что-то пошло не так и игра не создалась. Читай логи!');
                }
            } catch(error) {
                console.error('ADDING GAME ERROR', error);
            }

        } else {
            bot.sendMessage(chatId, 'Кажется у нас нет зарегистрированных игроков для игры :(');
            return;
        }
    } else {
        bot.sendMessage(chatId, 'Введённый формат неверный. Введите в формате \`\/startgame ДД.ММ.ГГГГ\/ЧЧ:ММ (время начала)\/ЧЧ:ММ (время конца)\/количество мест' +
        '\/место проведения\/название игры\`');
    }
}

function tagUsersForGame(users) {
    return users.map((user, index) => user.username ? `${(index + 1)}. @${user.username}` :
        `${(index + 1)}. <a href="tg://user?id=${user.user_id}">${user.first_name}</a>`).join('\n');
}

async function showGames(chatId, bot, isDelete = false) {
    let gameButtons = [];

    try {
        const games = await getGamesFromDatabase(chatId);

        if (games && games.length > 0) {
            if (isDelete) {
                gameButtons = games.map(game => [
                    {text: `${game.label}`, callback_data: `deletefromgame_${game.id}`}
                ]);
            }

            gameButtons = games.map(game => [
                {text: `+ на ${skloneniye(game.label, 'винительный')}`, callback_data: `appointment_${game.id}`},
                {text: `+/- на ${skloneniye(game.label, 'винительный')}`, callback_data: `notconfirmed_${game.id}`},
                {text: `- на ${skloneniye(game.label, 'винительный')}`, callback_data: `decline_${game.id}`}
            ]);

            const gamesString = games.map((game, index) =>
                `Игра №${(index + 1)}\n` +
                `    Дата: ${moment(game.game_date).format('DD.MM.YYYY')} (${game.label})\n` +
                `    Время: с ${moment(game.game_starts, 'HH:mm:ss').format('HH:mm')} по ${moment(game.game_ends, 'HH:mm:ss').format('HH:mm')}\n` +
                `    Место: ${game.place}`, {parse_mode: 'MarkdownV2'}
            ).join('\n----------------------------------\n');

            bot.sendMessage(chatId, gamesString, {
                reply_markup: {
                    inline_keyboard: [...gameButtons]
                }
            });
        } else {
            bot.sendMessage(chatId, 'А игр ещё нет :(');   
        }
    } catch (error) {
        console.error('SHOW GAME ERROR', error);
    }
}

async function deactiveGames(msg, bot) {
    const chatId = msg.chat.id;
    let gameDeactiveButtons = [];

    try {
        const games = await getGamesFromDatabase(chatId);

        if (games && games.length > 0) {
            const gamesString = games.map((game, index) =>
                `Игра №${(index + 1)}\n` +
                `    Дата: ${moment(game.game_date).format('DD.MM.YYYY')} (${game.label})\n`
            ).join('\n----------------------------------\n');

            gameDeactiveButtons = games.map(game => ({
                text: `Закрыть игру на ${skloneniye(game.label, 'винительный')} (для админов)`,
                callback_data: `deactivegame_${game.id}`}));

            // gameDeactiveButtons = games.map(game => Markup.callbackButton(`Закрыть игру на ${game.label} (для админов)`, `deactivegame_${game.id}`));

            const inlineKeyboard = Markup.inlineKeyboard(gameDeactiveButtons);

            bot.sendMessage(chatId, gamesString, {
                reply_markup: {
                    inline_keyboard: [gameDeactiveButtons]
                    //inline_keyboard: inlineKeyboard
                }
            });
        } else {
            bot.sendMessage(chatId, 'Ты не можешь деактивировать игру, если активных игр нет');
        }
    } catch (error) {
        console.error('DEACTIVE GAME ERROR', error);
    }
}

async function changeGameLimit(msg, bot) {
    const chatId = msg.chat.id;
    const parts = msg.text.replace('/changelimit ', '').split('/');
    
    // Если указаны все данные, сохраняем их
    if (parts.length === 2) {

        const limitOptions = {
            label: parts[0],
            limit: parts[1]
        }

        try {
            const label = await changeGameLimitFromDataBase(chatId, limitOptions);

            if (label) {
                bot.sendMessage(chatId, `Изменено количество игроков на игру в ${skloneniye(label, 'винительный')}!`);
            } else {
                bot.sendMessage(chatId, 'Кажется, такой игры больше нет');
            }
        } catch (error) {
            console.error('LIMIT CHANGE ERROR', error);
        }
    } else {
        bot.sendMessage(chatId, 'Неверный формат. Правильный формат: \`\/changelimit [название игры]\/[новый лимит]');
    }
}

module.exports = {
    startGame,
    showGames,
    deactiveGames,
    changeGameLimit
}