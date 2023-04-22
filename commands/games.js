const moment = require('moment');
const { getUsersFromDatabase, addGameToDatabase } = require('../database');

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
            quote: parts[3],
            location: parts[4],
            label: parts[5]
        }

        let taggedUsers = '';

        const users = await getUsersFromDatabase(chatId);

        if (users && users.length > 0) {
            taggedUsers = tagUsersForGame(users);

            try {
                const gameId = await addGameToDatabase(chatId, gameOptions);

                if (gameId && gameId > 0) {
                    bot.sendMessage(chatId, `Игра создана на ${gameOptions.date}\nс ${gameOptions.start} до ${gameOptions.end}.\n` +
                        `Место: ${gameOptions.location}\n\n${taggedUsers}`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {text: 'Oyuna yazılmaq / Записаться на игру', callback_data: `appointment_${gameId}`},
                                ],
                                [
                                    {text: 'Dəqiq deyil / Не точно', callback_data: `notexactly_${gameId}`},
                                ],
                                [
                                    {text: 'İmtina etmək / Отказаться от игры', callback_data: `decline_${gameId}`}
                                ]
                            ]
                        }
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

function showGames(pool, msg, bot) {
    const chatId = msg.chat.id;
    
    let gameButtons = [];

    pool.query(`SELECT * FROM games WHERE chat_id = ${chatId} AND status = TRUE`, (err, res) => {
        if (err) {
            console.log(err);
            bot.sendMessage(chatId, 'Произошла ошибка: ' + err);
        }
        else {
            gameButtons = res.rows.map(row => [
                {text: `+ на ${row.label}`, callback_data: `appointment_${row.id}`},
                {text: `+/- на ${row.label}`, callback_data: `notexactly_${row.id}`},
                {text: `- на ${row.label}`, callback_data: `decline_${row.id}`}
            ]);

            const games = res.rows.map((row, index) =>
                `Игра №${(index + 1)}\n` +
                `    Дата: ${moment(row.game_date).format('DD.MM.YYYY')}\n` +
                `    Время: с ${moment(row.game_starts, 'HH:mm:ss').format('HH:mm')} по ${moment(row.game_ends, 'HH:mm:ss').format('HH:mm')}\n` +
                `    Место: ${row.place}`, {parse_mode: 'MarkdownV2'}
            );

            if (games.length === 0) {
                bot.sendMessage(chatId, 'А игр ещё нет :(');
            } else {
                bot.sendMessage(chatId, games.join('\n----------------------------------\n'), {
                    reply_markup: {
                        inline_keyboard: [...gameButtons]
                    }
                });
            }
        }
    });
}

function deactiveGames(pool, msg, bot) {
    const chatId = msg.chat.id;

    let gameDeactiveButtons = [];

    pool.query(`SELECT * FROM games WHERE chat_id = ${chatId} AND status = TRUE`, (err, res) => {
        if (err) {
            bot.sendMessage(chatId, 'Произошла ошибка: ' + err);
        }
        else {
            gameDeactiveButtons = res.rows.map(row => ({text: `Закрыть игру на ${row.label} (для админов)`, callback_data: `deactivegame_${row.id}`}));

            const games = res.rows.map((row, index) =>
                `Игра №${(index + 1)}\n` +
                `    Дата: ${moment(row.game_date).format('DD.MM.YYYY')}\n`
            );

            if (games.length === 0) {
                bot.sendMessage(chatId, 'А игр ещё нет :(');
            } else {
                bot.sendMessage(chatId, games.join('\n----------------------------------\n'), {
                    reply_markup: {
                        inline_keyboard: [gameDeactiveButtons]
                    }
                });
            }
        }
    });
}

module.exports = {
    startGame,
    showGames,
    deactiveGames
}