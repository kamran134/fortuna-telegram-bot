const TelegramBot = require('node-telegram-bot-api');
const { Pool } = require('pg');
const moment = require('moment');
const commands = require('./commands');

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

// msg.from.id === 112254199

// Слушаем сообщения
bot.on('message', async (msg) => {
    const command = msg.text.toLowerCase();
    const messageText = msg.text;
    const chatId = msg.chat.id;
    
    if (command === '/регистрация' || command === '/register' || command === '/register@fortunavolleybalbot') commands.register(pool, msg, bot);
    if (command === '/tagregistered' || command === '/tagregistered@fortunavolleybalbot') commands.tagregistered(pool, msg, bot);
    if (messageText.startsWith('/startgame')) commands.startgame(pool, msg, bot);
    if (messageText.startsWith('/showgames')) commands.showgames(pool, msg, bot);
    if (command === 'приффки') bot.sendMessage(msg.chat.id, 'ПрИфФкИ, ' + msg.from.first_name + '. КаК дЕлИфФкИ');
    if (msg.text.toLowerCase() === 'привет') bot.sendMessage(msg.chat.id, 'Алейкум привет, ' + msg.from.first_name + '. Играть будем?');
    if (msg.text === '+') commands.plus(pool, msg, bot);
    if (command === '-' || command === 'минус' || command === 'minus' || command === '/minus') commands.minus(pool, msg, bot);
    if (msg.text === '/список' || msg.text === '/list') commands.getList(pool, msg, bot);
    if (msg.text === 'Пока') bot.sendMessage(msg.chat.id, 'До свидания, ' + msg.from.first_name);
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const username = query.from.username;

    console.log('callback_query: ', query);

    let response;
    if (query.data === 'thursday') {
        response = `@${username}, вы записаны на четверг`;
    } else if (query.data === 'sunday') {
        response = `@${username}, вы записаны на воскресенье`;
    } else if (query.data.startsWith('game_')) {
        pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, exactly) VALUES ($1, (SELECT id FROM users u WHERE u.user_id = $2), $3, $4) ` +
            `ON CONFLICT (user_id, game_id) DO NOTHING;`, 
        [query.data.substring(5), query.from.id, moment(new Date()).toISOString(), true])
            .then(res => console.log(res))
            .catch(err => console.log('INSERT ERROR___: ', err));
    }
  
    bot.sendMessage(chatId, response);
});