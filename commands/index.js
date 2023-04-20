const moment = require('moment');

function register(pool, msg, bot) {
    pool.query('INSERT INTO users (first_name, last_name, user_id, chat_id, username, is_guest) VALUES ($1, $2, $3, $4, $5, FALSE)', 
        [msg.from.first_name, msg.from.last_name, msg.from.id, msg.chat.id, msg.from.username])
            .then(res => bot.sendMessage(msg.chat.id, "Siz uğurla botda qeydiyyatdan keçdiniz / Вы успешно зарегистрировались в боте"))
            .catch(err => console.error('Inserting error', err));
}

function registered(pool, msg, bot, command) {
    pool.query(`SELECT * FROM users WHERE chat_id = ${msg.chat.id}`, (err, res) => {
        if (err) {
            console.error(err);
            bot.sendMessage(msg.chat.id, 'Произошла ошибка: ' + err);
            return;
        }
        
        const users = res.rows.map(row => row.username ? `@${row.username}` :
            `<a href="tg://user?id=${row.user_id}">${row.first_name}</a>`);
        const usersWithoutTag = res.rows.map(row => `${row.username} — ${row.first_name}`);
        
        if (users.length === 0) {
            bot.sendMessage(msg.chat.id, 'Никто не зарегистрировался в боте? Капец.');
        } else {
            bot.sendMessage(msg.chat.id, 'Зарегистрированные участники:\n' + 
               (command === 'tag' ? users.join('\n') : usersWithoutTag.join('\n')), {parse_mode: 'HTML'});
        }
    });
}

async function startgame(pool, msg, bot) {
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

        pool.query(`SELECT * FROM users WHERE chat_id = ${chatId};`, (err, res) => {
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

function showgames(pool, msg, bot) {
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

function deactivegames(pool, msg, bot) {
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

function getList(pool, msg, bot) {
    const chatId = msg.chat.id;

    pool.query(`SELECT users.last_name, users.first_name, users.username, games.game_date, game_users.game_id, game_users.exactly, games.quote FROM game_users ` +
        `LEFT JOIN users ON users.id = game_users.user_id ` +
        `LEFT JOIN games ON games.id = game_users.game_id ` +
        `WHERE games.chat_id = ${chatId} AND status = TRUE ` +
        `ORDER BY game_users.game_id, users.is_guest, game_users.exactly DESC, game_users.participate_time`, (err, res) => {

        if (err) {
            console.error(err);
            bot.sendMessage(chatId, 'Произошла ошибка: ' + err);
            return;
        }

        const usersByGame = {};
        const resultMessage = [];

        let i = 1;

        res.rows.forEach(row => {
            if (!usersByGame[row.game_id]) {
                i = 1;
                usersByGame[row.game_id] = {
                    users: [{
                        ind: i, last_name: row.last_name, first_name: row.first_name, username: row.username, exactly: row.exactly
                    }],
                    game_date: row.game_date,
                    quote: row.quote
                };
            } else usersByGame[row.game_id] = {
                users: [...usersByGame[row.game_id].users, {ind: i, last_name: row.last_name, first_name: row.first_name, username: row.username, exactly: row.exactly}],
                game_date: row.game_date,
                quote: row.quote
            };

            i++;
        });

        if (Object.keys(usersByGame).length === 0) {
            bot.sendMessage(msg.chat.id, 'Нет записавшихся на игру. Капец.');
        } else {
            for (const game_id of Object.keys(usersByGame)) {
                if (!game_id) return;

                const placeLeft = usersByGame[game_id].quote - usersByGame[game_id].users.length;
                const gameQuote = usersByGame[game_id].quote;

                const users = usersByGame[game_id].users.map(user => `${user.ind === (gameQuote + 1) ? '\n--------------Wait list--------------\n' : ''}${user.ind}. ${user.first_name} ${user.last_name}${user.exactly ? '' : '*'}`).join('\n');
                const message = `Игра на ${moment(usersByGame[game_id].game_date).format("DD.MM.YYYY")}:\n\n` +
                                `Участники:\n${users}\n\n` +
                                `Осталось мест: ${(placeLeft >= 0 ? placeLeft : 0)}`;

                resultMessage.push(message);
            }

            bot.sendMessage(msg.chat.id, resultMessage.join('\n////////////////////////////////\n'));
        }
    });
}

function plus(pool, msg, bot) {
    const chatId = msg.chat.id;
    
    bot.sendMessage(msg.from.id, 'Ağıllı ol!');

    bot.sendMessage(chatId, 'Выберите день:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'На четверг', callback_data: 'thursday' },
                    { text: 'На воскресенье', callback_data: 'sunday' },
                ]
            ]
        }
    });
}

function minus(pool, msg, bot) {
    const userId = msg.from.id;
    pool.query('DELETE FROM game_users WHERE user_id = $1 AND chat_id = ', [userId, msg.chat.id], (err, result) => {
        if (err) {
            console.error('Error deleting user from the database', err);
            bot.sendMessage(msg.chat.id, 'Произошла ошибка при удалении пользователя из базы данных');
        } else {
            console.log(`Deleted ${result.rowCount} row(s) from the database`);
            bot.sendMessage(msg.chat.id, `Вы были удалены из списка игроков, ${msg.from.first_name}`);
        }
    });
}

function addguest(pool, msg, bot) {
    const messageText = msg.text && msg.text.startsWith('/') ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '') : msg.text ? msg.text.toLowerCase() : '';
    const chatId = msg.chat.id;
    const query = messageText.replace('/addguest ', '');
    const parts = query.split('/');

    const gameLabel = parts[0];
    const fullname = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    const first_name = fullname.split(' ')[0];
    const last_name = fullname.split(' ')[1] | ' ';
    const exactly = parts.length > 2 && parts[2].includes('*') ? false : true;
    let userId = 0;

    pool.query(`INSERT INTO users (user_id, chat_id, is_guest, guest_name, first_name, last_name) VALUES ((SELECT MAX(id) FROM users) + 1, $1, TRUE, $2, $3, $4) RETURNING id`,
        [chatId, fullname, first_name, last_name])
        .then(res => {
            console.log('Insert guest res: ', JSON.stringify(res));
            userId = res.rows[0].id;

            if (userId > 0) {
                pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, exactly) VALUES ((SELECT MAX(id) FROM games g WHERE g.label = $1 AND g.chat_id = $2 AND g.status = TRUE), $3, $4, $5) ` +
                    `ON CONFLICT (user_id, game_id) DO NOTHING;`, 
                [gameLabel, chatId, userId, moment(new Date()).toISOString(), exactly])
                    .then(res => {
                        console.log(res);
                        bot.sendMessage(chatId, `Вы записали ${fullname} на ${gameLabel}!` + (!exactly ? ' Но это не точно :(' : ''))
                    })
                    .catch(err => console.log('INSERT GUEST TO GAME ERROR: ', err));
            }
        })
        .catch(err => console.error('INSERT GUEST TO USERS ERROR: ', err));
}

function agilliol(pool, msg, bot) {
    pool.query(`SELECT * FROM users WHERE chat_id = ${msg.chat.id} ORDER BY RANDOM() LIMIT 1;`, (err, res) => {
        if (err) {
            console.error(err);
            bot.sendMessage(msg.chat.id, 'Произошла ошибка: ' + err);
            return;
        }
        
        if (res.rows && res.rows[0] && res.rows[0].username) bot.sendMessage(msg.chat.id, `@${res.rows[0].username}, ağıllı ol!`);
    });
}

function whatTime(pool, msg, bot) {
    const chatId = msg.chat.id;
    pool.query(`SELECT game_starts, label FROM games WHERE chat_id = $1 AND status = TRUE`, [chatId])
        .then(res => {
            console.log('What time res: ', JSON.stringify(res));
            
            const gameTimes = res.rows.map(row => `${row.label}: ${row.game_starts}`).join(', ');

            bot.sendMessage(chatId, `Мэээх. Сколько можно спрашивать? :/\n${gameTimes}`);
        })
        .catch(err => console.error('What time error: ', err))
}

module.exports = {
    register,
    registered,
    startgame,
    showgames,
    plus,
    minus,
    getList,
    addguest,
    deactivegames,
    agilliol,
    whatTime
}