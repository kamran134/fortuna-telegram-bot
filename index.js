const TelegramBot = require('node-telegram-bot-api');
const { Pool } = require('pg');
const moment = require('moment');

// Устанавливаем токен, который вы получили от BotFather
const token = '5853539307:AAGIfxr3O_mu-uN07fqYCirWzxTHs-UqrJY';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// const chatId = msg.chat.id;
// const chatMembersCount = await bot.getChatMembersCount(chatId);

// Создаем пулл соединений к базе данных
const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'fortuna',
    password: 'postgres',
    port: 5432,
});

const users = [];

// Слушаем сообщения
bot.on('message', async (msg) => {
    const command = msg.text.toLowerCase();
    const messageText = msg.text;
    const chatId = msg.chat.id;
    
    if (command === '/регистрация' || command === '/register' || command === '/register@fortunavolleybalbot') {
        pool.query('INSERT INTO users (first_name, last_name, user_id, chat_id, username) VALUES ($1, $2, $3, $4, $5)', 
        [msg.from.first_name, msg.from.last_name, msg.from.id, msg.chat.id, msg.from.username])
            .then(res => console.log('Successful', res))
            .catch(err => console.error('Inserting error', err));
    }

    if (command === '/tagregistered' || command === '/tagregistered@fortunavolleybalbot') {
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

    if (messageText.startsWith('/startgame')) {
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

    if (messageText.startsWith('/showgames')) {

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

    // if (msg.text.toLowerCase() === '/tagall' || msg.text.toLowerCase() === '/отметитьвсех') {
    //     const chatId = msg.chat.id;
        
    //     try {
    //         // Получаем количество участников в группе
    //         const chatMemberCount = await bot.getChatMemberCount(chatId);
        
    //         // Получаем информацию о каждом участнике группы и формируем строку с упоминаниями
    //         let taggedMembers = '';
    //         for (let i = 0; i < chatMemberCount; i++) {
    //         const chatMember = await bot.getChatMember(chatId, i);
    //         if (chatMember.user.username) {
    //             taggedMembers += `@${chatMember.user.username} `;
    //         } else {
    //             taggedMembers += `[${chatMember.user.first_name}](tg://user?id=${chatMember.user.id}) `;
    //         }
    //         }
        
    //         // Отправляем сообщение с упоминаниями всех участников группы
    //         bot.sendMessage(chatId, taggedMembers, {parse_mode: 'MarkdownV2'});
    //     }
    //     catch (error) {
    //         console.error(error);
    //         bot.sendMessage(chatId, error);
    //     }
    // }
    
    // Если пользователь отправил "Привет"
    if (msg.text.toLowerCase() === 'приффки') {
        // Отправляем ответное сообщение
        bot.sendMessage(msg.chat.id, 'ПрИфФкИ, ' + msg.from.first_name + '. КаК дЕлИфФкИ');
    }

    if (msg.text.toLowerCase() === 'привет') {
        // Отправляем ответное сообщение
        bot.sendMessage(msg.chat.id, 'Алейкум привет, ' + msg.from.first_name + '. Играть будем?');
    }

    if (msg.text === '+') {
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

    if (command === '-' || command === 'минус' || command === 'minus' || command === '/minus') {
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

    if (msg.text === '/список' || msg.text === '/list') {
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
                if (!usersByGame[row.game_id]) {
                    i = 1;
                    usersByGame[row.game_id] = [{ind: i, last_name: row.last_name, first_name: row.first_name, username: row.username, game_date: row.game_date}]
                    i++;
                } else {
                    usersByGame[row.game_id] = [...usersByGame[row.game_id], {ind: i, last_name: row.last_name, first_name: row.first_name, username: row.username, game_date: row.game_date}];
                    i++;
                }
            });

            // const users = res.rows.map((row, index) => `${(index + 1)}. ${row.first_name} ${row.last_name}`);
            
            if (res.rows.length === 0) {
                bot.sendMessage(msg.chat.id, 'Нет записавшихся на игру. Капец.');
            } else {
                for (const game_id in usersByGame) {
                    const users = usersByGame[game_id].map(user => `${user.ind}. ${user.first_name} ${user.last_name}`).join('\n');
                    const message = `Игра на ${moment(user.game_date).format("DD.MM.YYYY")}\n` +
                                    `Участники:\n${users}`;
                    bot.sendMessage(chatId, message);
                  }
                // bot.sendMessage(msg.chat.id, 'Записавшиеся:\n' + users.join('\n'));
            }
        });
    }

    if (msg.text.toLowerCase() === '/очистить' && msg.from.id === 112254199) {
        users.length = 0;
        bot.sendMessage(msg.chat.id, users.map((user, index) => (index+1) + ". " + user.fullname).join('\n'));
    }

    // Если пользователь отправил "Пока"
    if (msg.text === 'Пока') {
        // Отправляем ответное сообщение
        bot.sendMessage(msg.chat.id, 'До свидания, ' + msg.from.first_name);
    }
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const username = query.from.username;
  
    let response;
    if (query.data === 'thursday') {
        response = `@${username}, вы записаны на четверг`;
    } else if (query.data === 'sunday') {
        response = `@${username}, вы записаны на воскресенье`;
    } else if (query.data.startsWith('game_')) {
        console.log('user clicked, user id: ' + query.from.id);
        pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, exactly) VALUES ($1, (SELECT id FROM users u WHERE u.user_id = $2), $3, $4)`, 
        [query.data.substring(5), query.from.id, moment(new Date()).toISOString(), true])
            .then(res => console.log(res))
            .catch(err => console.log('insert error: ', err));
    }
  
    bot.sendMessage(chatId, response);
});