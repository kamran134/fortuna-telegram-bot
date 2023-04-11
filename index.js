const TelegramBot = require('node-telegram-bot-api');
const { Pool } = require('pg');

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
    command = msg.text.toLowerCase();
    
    if (command === '/регистрация' || command === '/register') {
        pool.query('INSERT INTO users (first_name, last_name, user_id, chat_id, username) VALUES ($1, $2, $3, $4, $5)', 
        [msg.from.first_name, msg.from.last_name, msg.from.id, msg.chat.id, msg.from.username])
            .then(res => console.log('Successful', res))
            .catch(err => console.error('Inserting error', err));
    }

    if (command === '/tagregistered') {
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

    if (command === '+' || command === 'плюс' || command === 'plus' || command === '/plus') {
        pool.query('INSERT INTO users (user_id, fullname, chat_id) VALUES ($1, $2, $3) ON CONFLICT (id) ' +
        'DO NOTHING', [msg.from.id, msg.from.first_name + ' ' + msg.from.last_name, msg.chat.id])
            .then(res => {
                console.log('User inserted successfully');
            })
            .catch(err => {
                console.error('Error inserting user', err);
            });
    }

    if (command === '-' || command === 'минус' || command === 'minus' || command === '/minus') {
        const userId = msg.from.id;
        pool.query('DELETE FROM users WHERE user_id = $1 AND chat_id = ', [userId, msg.chat.id], (err, result) => {
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
        pool.query(`SELECT * FROM users WHERE chat_id = ${msg.chat.id}`, (err, res) => {
            if (err) {
                console.error(err);
                bot.sendMessage(msg.chat.id, 'Произошла ошибка: ' + err);
                return;
            }
            
            const users = res.rows.map((row, index) => `${(index + 1)}. ${row.fullname}`);
            
            if (users.length === 0) {
                bot.sendMessage(msg.chat.id, 'Нет записавшихся на игру. Капец.');
            } else {
                bot.sendMessage(msg.chat.id, 'Записавшиеся:\n' + users.join('\n'));
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