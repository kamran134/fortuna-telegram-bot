const TelegramBot = require('node-telegram-bot-api');
const { Pool } = require('pg');
const moment = require('moment');
const commands = require('./commands');
const callbacks = require('./callbacks');

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
    else if (messageText === '/tagregistered' && isAdmin) commands.registered(pool, msg, bot, 'tag');
    else if (messageText === '/tagregistered' && !isAdmin) bot.sendMessage(msg.chat.id, 'Только одмэн может массово беспокоить всех!');
    else if (messageText === '/showregistered') commands.registered(pool, msg, bot, 'show');
    else if (messageText.startsWith('/startgame') && isAdmin) commands.startgame(pool, msg, bot);
    else if (messageText.startsWith('/startgame') && !isAdmin) bot.sendMessage(msg.chat.id, 'Только админ может создать игру. Be clever!', {reply_to_message_id: msg.message_id});
    else if (messageText === '/showgames') commands.showgames(pool, msg, bot);
    else if (messageText === '/deletegame') {}
    else if (messageText === '/deactivegame') {}
    else if (messageText === 'приффки') bot.sendMessage(msg.chat.id, 'ПрИфФкИ, ' + msg.from.first_name + '. КаК дЕлИфФкИ');
    else if (messageText === 'привет') bot.sendMessage(msg.chat.id, 'Привет, ' + msg.from.first_name + '. Играть будем?');
    else if (messageText === '/список' || messageText === '/list') commands.getList(pool, msg, bot);
    else if (messageText === 'Пока') bot.sendMessage(msg.chat.id, 'До свидания, ' + msg.from.first_name);
    else if (messageText === '/agilliol' || messageText === '/ağıllı ol') commands.agilliol(pool, msg, bot);
    else if (messageText.startsWith('/addguest')) commands.addguest(pool, msg, bot);
});

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;

    const chatMember = await bot.getChatMember(chatId, query.from.id);
    const isAdmin = chatMember.status === 'administrator' || chatMember.status === 'creator';

    if (query.data.startsWith('appointment_')) callbacks.appointmentToTheGame(pool, query, bot);
    else if (query.data.startsWith('notexactly_')) callbacks.notExactlyAppointment(pool, query, bot);
    else if (query.data.startsWith('decline_')) callbacks.declineAppointment(pool, query, bot);
    else if (query.data.startsWith('deactivegame_') && isAdmin) callbacks.deactiveGame(pool, query, bot);
    else if (query.data.startsWith('deactivegame_') && !isAdmin) bot.sendMessage(chatId, 'Бый! Только админ может деактивировать игру', { reply_to_message_id: query.data.message_id });
});