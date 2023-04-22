const TelegramBot = require('node-telegram-bot-api');
const { Pool } = require('pg');
const commands = require('./commands');
const { register, getRegistered, startGame, showGames, deactiveGames } = require('./commands');
const adminCommands = require('./commands/adminCommands');
const callbacks = require('./callbacks');

// Устанавливаем токен, который вы получили от BotFather
const token = '5853539307:AAGIfxr3O_mu-uN07fqYCirWzxTHs-UqrJY';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Создаем пулл соединений к базе данных
const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'fortuna',
    password: 'postgres',
    port: 5432,
});

// Слушаем сообщения
bot.on('message', async (msg) => {
    const messageText = msg.text && msg.text.startsWith('/') ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '') : msg.text ? msg.text.toLowerCase() : '';
    const chatMember = await bot.getChatMember(msg.chat.id, msg.from.id);
    const isAdmin = chatMember.status === 'administrator' || chatMember.status === 'creator';

    if (messageText === '/register') await register(msg, bot);
    else if (messageText === '/tagregistered' && isAdmin) await getRegistered(msg, bot, 'tag');
    else if (messageText === '/tagregistered' && !isAdmin) bot.sendMessage(msg.chat.id, 'Только одмэн может массово беспокоить всех!');
    else if (messageText === '/showregistered') await getRegistered(msg, bot, 'show');
    else if (messageText.startsWith('/startgame') && isAdmin) startGame(msg, bot);
    else if (messageText.startsWith('/startgame') && !isAdmin) bot.sendMessage(msg.chat.id, 'Только одмэн может создать игру. Be clever!', {reply_to_message_id: msg.message_id});
    else if (messageText === '/showgames') await showGames(msg, bot);
    else if (messageText === '/deletegame') {}
    else if (messageText === '/deactivegame' && isAdmin) await deactiveGames(msg, bot);
    else if (messageText === '/deactivegame' && !isAdmin) bot.sendMessage(msg.chat.id, 'Только одмэн может деактивировать игру. А для вас есть специальная команда: /agilliol :D');
    else if (messageText === 'приффки') bot.sendMessage(msg.chat.id, 'ПрИфФкИ, ' + msg.from.first_name + '. КаК дЕлИфФкИ');
    else if (messageText === 'привет') bot.sendMessage(msg.chat.id, 'Привет, ' + msg.from.first_name + '. Играть будем?');
    else if (messageText === '/list') commands.getGamePlayers(pool, msg, bot);
    else if (messageText === 'Пока') bot.sendMessage(msg.chat.id, 'До свидания, ' + msg.from.first_name);
    else if (messageText.startsWith('/addguest') && isAdmin) commands.addGuest(pool, msg, bot);
    else if (messageText.startsWith('/addguest') && !isAdmin) bot.sendMessage(msg.chat.id, 'Только одмэн может добавлять гостя в игру. Обратитесь к одмэну.');
    else if (messageText.includes('во ск')) commands.whatTime(pool, msg, bot);
    else if (messageText === '/getgroupid' && isAdmin) bot.sendMessage(msg.from.id, `ID вашей группы ${msg.chat.id}`);
    else if (messageText === '/getgroupid' && !isAdmin) bot.sendMessage(msg.chat.id, 'Эта информация не для маглов!');
    else if (messageText === '/алохамора') bot.sendMessage(msg.chat.id, `Нет, ${msg.from.first_name}. Это заклинание не откроет тебе двери в админ-панель...`, {reply_to_message_id: msg.message_id});
    else if (messageText.includes('авада кедавра') || messageText.includes('авадакедавра')) bot.sendMessage(msg.chat.id, `De "sən öl"`, {reply_to_message_id: msg.message_id});
    else if (messageText === '/agilliol' || messageText === '/ağıllı ol') commands.agilliOl(pool, msg, bot);
    else if (messageText ==='А вы рыбов продоете' || messageText === 'А вы рыбов продоёте') bot.sendMessage(msg.chat.id, 'Нет, показываем.', {reply_to_message_id: msg.message_id});

    // for admin group
    else if (messageText.startsWith('/connectto') && isAdmin) adminCommands.connectto(pool, msg, bot);
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