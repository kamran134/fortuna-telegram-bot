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

// msg.from.id === 112254199

// Слушаем сообщения
bot.on('message', async (msg) => {
    const messageText = msg.text && msg.text.startsWith('/') ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '') : msg.text ? msg.text.toLowerCase() : '';
    const chatMember = await bot.getChatMember(msg.chat.id, msg.from.id);
    const isAdmin = chatMember.status === 'administrator' || chatMember.status === 'creator';

    if (messageText === '/register') commands.register(pool, msg, bot);
    else if (messageText === '/tagregistered') commands.tagregistered(pool, msg, bot);
    else if (messageText.startsWith('/startgame') && isAdmin) commands.startgame(pool, msg, bot);
    else if (messageText.startsWith('/startgame') && !isAdmin) bot.sendMessage(msg.chat.id, 'Только админ может создать игру. Be clever!', {reply_to_message_id: msg.message_id});
    else if (messageText === '/showgames') commands.showgames(pool, msg, bot);
    else if (messageText === '/deletegame') {}
    else if (messageText === '/deactivegame') {}
    else if (messageText === 'приффки') bot.sendMessage(msg.chat.id, 'ПрИфФкИ, ' + msg.from.first_name + '. КаК дЕлИфФкИ');
    else if (messageText === 'привет') bot.sendMessage(msg.chat.id, 'Алейкум привет, ' + msg.from.first_name + '. Играть будем?');
    // else if (messageText === '+') commands.plus(pool, msg, bot);
    // else if (messageText === '-' || messageText === 'минус' || messageText === 'minus' || messageText === '/minus') commands.minus(pool, msg, bot);
    else if (messageText === '/список' || messageText === '/list') commands.getList(pool, msg, bot);
    else if (messageText === 'Пока') bot.sendMessage(msg.chat.id, 'До свидания, ' + msg.from.first_name);
    else if (messageText === '/agilliol' || messageText === '/ağıllı ol') commands.agilliol(pool, msg, bot);
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
        pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, exactly) VALUES ($1, (SELECT id FROM users u WHERE u.user_id = $2), $3, TRUE) ` +
            `ON CONFLICT (user_id, game_id) DO NOTHING;`, 
        [query.data.substring(5), query.from.id, moment(new Date()).toISOString()])
            .then(res => console.log(res))
            .catch(err => console.log('INSERT ERROR___: ', err));
    }
    else if (query.data.startsWith('appointment')) {

        const dateString = query.data.replace('appointment_', '');
        const [day, month, year] = dateString.split('.');
        const gameDate = new Date(year, month - 1, day);

        pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, exactly) ` +
            `VALUES ((SELECT LAST(id) FROM games g WHERE g.chat_id = $1 AND g.game_date = $2), (SELECT id FROM users u WHERE u.user_id = $3), $4, TRUE) ` +
            `ON CONFLICT (user_id, game_id)  DO UPDATE SET exactly = TRUE, participate_time = $4;`, 
        [query.message.chat.id, moment(gameDate).toISOString(), query.from.id, moment(new Date()).toISOString()])
            .then(res => {
                console.log(res);
                bot.sendMessage(chatId, `@${username}, вы записались на ${dateString}!`);
            })
            .catch(err => console.log('INSERT ERROR___: ', err));
    }
    else if (query.data.startsWith('notexactly')) {

        const dateString = query.data.replace('notexactly_', '');
        const [day, month, year] = dateString.split('.');
        const gameDate = new Date(year, month - 1, day);

        pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, exactly) ` +
            `VALUES ((SELECT LAST(id) FROM games g WHERE g.chat_id = $1 AND g.game_date = $2), (SELECT id FROM users u WHERE u.user_id = $3), $4, FALSE) ` +
            `ON CONFLICT (user_id, game_id) DO UPDATE SET exactly = FALSE;`, 
        [query.message.chat.id, moment(gameDate).toISOString(), query.from.id, moment(new Date()).toISOString()])
            .then(res => {
                console.log(res);
                bot.sendMessage(chatId, `@${username}, вы записались на ${dateString}! https://youtu.be/V5MD0Zwhfb0`);
            })
            .catch(err => console.log('INSERT ERROR___: ', err));
    }
    else if (query.data.startsWith('decline')) {
        const dateString = query.data.replace('notexactly_', '');
        const [day, month, year] = dateString.split('.');
        const gameDate = new Date(year, month - 1, day);

        pool.query(`DELETE FROM game_users WHERE user_id = $1 AND game_id = (SELECT LAST(id) FROM games g WHERE g.game_date = $2);`, [query.from.id, moment(gameDate).toISOString()])
            .then(res => {
                console.log(res);
                bot.sendMessage(chatId, `@${username} удирает с игры. Бейте предателя!`)
            })
            .catch(err => console.log('DELETE ERROR___: ', err));
    }

    bot.sendMessage(chatId, response);
});