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
    const messageText = msg.text && msg.text.startsWith('/') ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '') : msg.text ? msg.text.toLowerCase() : '';
    
    if (messageText === '/register') commands.register(pool, msg, bot);
    if (messageText === '/tagregistered') commands.tagregistered(pool, msg, bot);
    if (messageText === '/startgame') commands.startgame(pool, msg, bot);
    if (messageText === '/showgames') commands.showgames(pool, msg, bot);
    if (messageText === 'приффки') bot.sendMessage(msg.chat.id, 'ПрИфФкИ, ' + msg.from.first_name + '. КаК дЕлИфФкИ');
    if (messageText === 'привет') bot.sendMessage(msg.chat.id, 'Алейкум привет, ' + msg.from.first_name + '. Играть будем?');
    if (messageText === '+') commands.plus(pool, msg, bot);
    if (messageText === '-' || messageText === 'минус' || messageText === 'minus' || messageText === '/minus') commands.minus(pool, msg, bot);
    if (messageText === '/список' || messageText === '/list') commands.getList(pool, msg, bot);
    if (messageText === 'Пока') bot.sendMessage(msg.chat.id, 'До свидания, ' + msg.from.first_name);
    if (messageText === '/agilliol' || messageText === '/ağıllı ol') commands.agilliol(pool, msg, bot);
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