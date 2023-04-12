function register(pool, msg, bot) {
    pool.query('INSERT INTO users (first_name, last_name, user_id, chat_id, username) VALUES ($1, $2, $3, $4, $5)', 
        [msg.from.first_name, msg.from.last_name, msg.from.id, msg.chat.id, msg.from.username])
            .then(res => console.log('Successful', res))
            .catch(err => console.error('Inserting error', err));
}

function tagregistered(pool, msg, bot) {
    pool.query(`SELECT * FROM users WHERE chat_id = ${msg.chat.id}`, (err, res) => {
        if (err) {
            console.error(err);
            bot.sendMessage(msg.chat.id, 'Произошла ошибка: ' + err);
            return;
        }
        
        const users = res.rows.map(row => `@${row.username}`);
        
        if (users.length === 0) {
            bot.sendMessage(msg.chat.id, 'Никто не зарегистрировался в боте? Капец.');
        } else {
            bot.sendMessage(msg.chat.id, 'Зарегистрированные участники:\n' + users.join('\n'));
        }
    });
}

async function startgame(pool, msg, bot) {
    const chatId = msg.chat.id;
    
    // Разбиваем текст команды на части
    const parts = messageText.split(' - ');
    
    // Если указаны все данные, сохраняем их
    if (parts.length === 5) {
        const date = parts[1];
        const startTime = parts[2];
        const endTime = parts[3];
        const location = parts[4];

        gameData = {date, startTime, endTime, location};

        pool.query('INSERT INTO games (game_date, game_starts, game_ends, place, chat_id, status) VALUES ($1, $2, $3, $4, $5, $6)', 
        [moment(date, 'DD.MM.YYYY').toISOString(), startTime, endTime, location, chatId, true])
            .then(res => {
                console.log('Successful', res);
                bot.sendMessage(chatId, `Игра создана на ${date} с ${startTime} до ${endTime}. Место: ${location}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Oyuna yazılmaq / Записаться на игру', callback_data: 'appointment'},
                                // {text: 'Время начала игры', callback_data: 'gamestart'}
                            ]
                        ]
                    }});
            })
            .catch(err => console.error('Inserting error', err));
    } else {
        // Иначе запрашиваем недостающую информацию
        await bot.sendMessage(chatId, 'Введите дату, время начала, время окончания и место проведения игры в формате: /startgame - дд.мм.гггг - hh:mm - hh:mm - место');
    }
}

function showgames(pool, msg, bot) {
    const chatId = msg.chat.id;
    
    const gameButtons = [];

    pool.query(`SELECT * FROM games WHERE chat_id = ${chatId} AND status = TRUE`, (err, res) => {
        if (err) {
            console.log(err);
            bot.sendMessage(chatId, 'Произошла ошибка: ' + err);
        }
        else {
            res.rows.map((row, index) => gameButtons.push({text: `Запись на игру №${(index + 1)}`, callback_data: `game_${row.id}`}));
            const games = res.rows.map((row, index) =>
                `Игра №${(index + 1)}\n` +
                `    Дата: ${moment(row.game_data).format('DD.MM.YYYY')}\n` +
                `    Время: с ${moment(row.game_starts, 'HH:mm:ss').format('HH:mm')} по ${moment(row.game_ends, 'HH:mm:ss').format('HH:mm')}\n` +
                `    Место: ${row.place}`, {parse_mode: 'MarkdownV2'
            });

            if (games.length === 0) {
                bot.sendMessage(chatId, 'А игр ещё нет :(');
            } else {
                bot.sendMessage(chatId, games.join('\n----------------------------------\n'), {
                    reply_markup: {
                        inline_keyboard: [gameButtons]
                    }
                });
            }
        }
    });
}

function getList(pool, msg, bot) {
    const chatId = msg.chat.id;

    pool.query(`SELECT users.last_name, users.first_name, users.username, games.game_date FROM game_users ` +
        `LEFT JOIN users ON users.id = game_users.user_id ` +
        `LEFT JOIN games ON games.id = game_users.game_id ` +
        `WHERE games.chat_id = ${chatId} ORDER BY game_users.game_id, game_users.participate_time`, (err, res) => {

        if (err) {
            console.error(err);
            bot.sendMessage(chatId, 'Произошла ошибка: ' + err);
            return;
        }

        const usersByGame = {};

        res.rows.map(row => {
            i = 1;
            if (!usersByGame[row.game_date]) {
                i = 1;
                usersByGame[row.game_date] = [{ind: i, last_name: row.last_name, first_name: row.first_name, username: row.username, game_date: row.game_date}]
                
            } else usersByGame[row.game_date] = [...usersByGame[row.game_id], {ind: i, last_name: row.last_name, first_name: row.first_name, username: row.username, game_date: row.game_date}];
            i++;
        });
        
        if (Object.keys(usersByGame).length === 0) {
            bot.sendMessage(msg.chat.id, 'Нет записавшихся на игру. Капец.');
        } else {
            for (const game_date in usersByGame) {

                console.log('GAME ID: ', game_date);
                
                if (!game_date) return;

                const users = usersByGame[game_id].map(user => `${user.ind}. ${user.first_name} ${user.last_name}`).join('\n');
                const message = `Игра на ${moment(game_date).format("DD.MM.YYYY")}\n` +
                                `Участники:\n${users}`;
                // bot.sendMessage(chatId, message);
            }
            // bot.sendMessage(msg.chat.id, 'Записавшиеся:\n' + users.join('\n'));
        }
    });
}

function plus(pool, msg, bot) {
    const chatId = msg.chat.id;
    
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

module.exports = {
    register,
    tagregistered,
    startgame,
    showgames,
    plus,
    minus,
    getList
}