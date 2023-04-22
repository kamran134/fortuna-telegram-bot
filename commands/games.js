const moment = require('moment');

async function startGame(pool, msg, bot) {
    const chatId = msg.chat.id;
    
    // Разбиваем текст команды на части
    const parts = msg.text.replace('/startgame ', '').split('/');
    
    // Если указаны все данные, сохраняем их
    if (parts.length === 6) {
        const date = parts[0];
        const startTime = parts[1];
        const endTime = parts[2];
        const quote = parts[3];
        const location = parts[4];
        const label = parts[5];

        let taggedUsers = '';

        pool.query(`SELECT * FROM users WHERE chat_id = ${chatId} AND is_guest = FALSE;`, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            
            if (res.rows && res.rows.length > 0) {
                taggedUsers = res.rows.map((user, index) => user.username ? `${(index + 1)}. @${user.username}` :
                    `${(index + 1)}. <a href="tg://user?id=${user.user_id}">${user.first_name}</a>`).join('\n');
            }
                
            pool.query('INSERT INTO games (game_date, game_starts, game_ends, quote, place, chat_id, status, label) VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7) RETURNING id', 
                [moment(date, 'DD.MM.YYYY').toISOString(), startTime, endTime, quote, location, chatId, label])
                .then(res => {
                    const gameId = res.rows[0].id;
                    bot.sendMessage(chatId, `Игра создана на ${date}\nс ${startTime} до ${endTime}.\nМесто: ${location}\n\n${taggedUsers}`, {
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
                        }});
                })
                .catch(err => console.error('Inserting error', err));
            }
        );
    } else {
        await bot.sendMessage(chatId, 'Введённый формат неверный. Введите в формате \`\/startgame ДД.ММ.ГГГГ\/ЧЧ:ММ (время начала)\/ЧЧ:ММ (время конца)\/количество мест' +
        '\/место проведения\/название игры\`');
    }
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