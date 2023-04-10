const TelegramBot = require('node-telegram-bot-api');
const { Pool } = require('pg');

// Устанавливаем токен, который вы получили от BotFather
const token = '5853539307:AAGIfxr3O_mu-uN07fqYCirWzxTHs-UqrJY';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Создаем пулл соединений к базе данных
const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'mydatabase',
    password: 'mysecretpassword',
    port: 5432,
});

const users = [];

// Слушаем сообщения
bot.on('message', (msg) => {
    // Если пользователь отправил "Привет"
    if (msg.text.toLowerCase() === 'приффки') {
        // Отправляем ответное сообщение
        bot.sendMessage(msg.chat.id, 'ПрИфФкИ, ' + msg.from.first_name + '. КаК дЕлИфФкИ');
    }

    if (msg.text.toLowerCase() === 'привет') {
        // Отправляем ответное сообщение
        bot.sendMessage(msg.chat.id, 'Алейкум привет, ' + msg.from.first_name + '. Играть будем?');
    }

    if (msg.text.toLowerCase() === '+' || msg.text.toLowerCase() === 'плюс' || msg.text.toLowerCase() === 'plus') {
        pool.query('INSERT INTO users (id, fullname) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING', [msg.from.id, msg.from.first_name + ' ' + msg.from.last_name])
            .then(res => {
                console.log('User inserted successfully');
            })
            .catch(err => {
                console.error('Error inserting user', err);
            });
        
        // if (!users.some(user => user.id === msg.from.id)) {
        //     users.push({id: msg.from.id, fullname: msg.from.first_name + ' ' + msg.from.last_name});
        // }
        // bot.sendMessage(msg.chat.id, users.map((user, index) => (index+1) + ". " + user.fullname).join('\n'));
    }

    if (msg.text === '-' || msg.text.toLowerCase() === 'минус' || msg.text.toLowerCase() === 'minus') {
        // bot.sendMessage(msg.chat.id, 'Это будет сложно, но как-нибудь выживем без тебя, ' + msg.from.first_name);
        // users = users.filter(user => user.id !== msg.from.id);
        // bot.sendMessage(msg.chat.id, users.filter(user => user.id !== msg.from.id).map((user, index) => (index+1) + ". " + user.fullname).join('\n'));
        const userId = msg.from.id;
        pool.query('DELETE FROM users WHERE telegram_id = $1', [userId], (err, result) => {
            if (err) {
                console.error('Error deleting user from the database', err);
                bot.sendMessage(msg.chat.id, 'Произошла ошибка при удалении пользователя из базы данных');
            } else {
                console.log(`Deleted ${result.rowCount} row(s) from the database`);
                bot.sendMessage(msg.chat.id, `Вы были удалены из списка игроков, ${msg.from.first_name}`);
            }
        });
    }

    // if (msg.text.toLowerCase() === '\/список') {
    //     bot.sendMessage(msg.chat.id, users.map((user, index) => (index+1) + ". " + user.fullname).join('\n'));
    // }

    if (msg.text === '/список') {
        pool.query('SELECT * FROM users', (err, res) => {
            if (err) {
                console.error(err);
                bot.sendMessage(msg.chat.id, 'Произошла ошибка');
                return;
            }
            
            const users = res.rows.map(row => `${row.fullname} (${row.id})`);
            
            if (users.length === 0) {
                bot.sendMessage(msg.chat.id, 'Нет записавшихся на игру. Капец.');
            } else {
                bot.sendMessage(msg.chat.id, 'Записавшиеся:\n' + users.join('\n'));
            }
        });
    }
      

    if (msg.text.toLowerCase() === '\/очистить' && msg.from.id === 112254199) {
        users.length = 0;
        bot.sendMessage(msg.chat.id, users.map((user, index) => (index+1) + ". " + user.fullname).join('\n'));
    }

    // Если пользователь отправил "Пока"
    if (msg.text === 'Пока') {
        // Отправляем ответное сообщение
        bot.sendMessage(msg.chat.id, 'До свидания, ' + msg.from.first_name);
    }
});