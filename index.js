const TelegramBot = require('node-telegram-bot-api');
const { Pool } = require('pg');
const {
    register, getRegistered, startGame, showGames, deactiveGames,
    getGamePlayers, addGuest, whatTime, agilliOl, getAzList,
    connectTo, showGroups, showYourGroups
} = require('./commands');
const adminCommands = require('./commands/adminCommands');
const {
    appointmentToTheGame, declineAppointment, notExactlyAppointment, 
    deactiveGame, startGameInSelectedGroup, showGamesInSelectedGroup
} = require('./callbacks');

// Устанавливаем токен, который вы получили от BotFather
const token = '5853539307:AAGIfxr3O_mu-uN07fqYCirWzxTHs-UqrJY';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Слушаем сообщения
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const messageText = msg.text && msg.text.startsWith('/') ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '') : msg.text ? msg.text.toLowerCase() : '';
    const chatMember = await bot.getChatMember(chatId, userId);
    const isAdmin = chatMember.status === 'administrator' || chatMember.status === 'creator';

    if (messageText === '/register') register(msg, bot);
    else if (messageText === '/tagregistered' && isAdmin) getRegistered(msg, bot, 'tag');
    else if (messageText === '/tagregistered' && !isAdmin) bot.sendMessage(chatId, 'Только одмэн может массово беспокоить всех!');
    else if (messageText === '/showregistered') getRegistered(msg, bot, 'show');
    else if (messageText.startsWith('/startgame') && isAdmin) startGame(msg, bot);
    else if (messageText.startsWith('/startgame') && !isAdmin) bot.sendMessage(chatId, 'Только одмэн может создать игру. Be clever!', {reply_to_message_id: msg.message_id});
    else if (messageText === '/showgames') showGames(msg, bot);
    else if (messageText === '/deletegame') {}
    else if (messageText === '/deactivegame' && isAdmin) deactiveGames(msg, bot);
    else if (messageText === '/deactivegame' && !isAdmin) bot.sendMessage(chatId, 'Только одмэн может деактивировать игру. А для вас есть специальная команда: /agilliol :D');
    else if (messageText === 'приффки') bot.sendMessage(chatId, 'ПрИфФкИ, ' + msg.from.first_name + '. КаК дЕлИфФкИ. (Что за ванилька из начала нулевых?)');
    else if (messageText === 'привет') bot.sendMessage(chatId, 'Привет, ' + msg.from.first_name + '. Играть будем?');
    else if (messageText === '/list') getGamePlayers(msg, bot);
    else if (messageText === 'Пока') bot.sendMessage(chatId, 'До свидания, ' + msg.from.first_name);
    else if (messageText.startsWith('/addguest') && isAdmin) addGuest(msg, bot);
    else if (messageText.startsWith('/addguest') && !isAdmin) bot.sendMessage(chatId, 'Только одмэн может добавлять гостя в игру. Обратитесь к одмэну.');
    else if (messageText.includes('во ск')) whatTime(msg, bot);
    else if (messageText === '/getgroupid' && isAdmin) bot.sendMessage(userId, `ID вашей группы ${chatId}`);
    else if (messageText === '/getgroupid' && !isAdmin) bot.sendMessage(chatId, 'Эта информация не для маглов!');
    else if (messageText === '/алохамора') bot.sendMessage(chatId, `Нет, ${msg.from.first_name}. Это заклинание не откроет тебе двери в админ-панель...`, {reply_to_message_id: msg.message_id});
    else if (messageText.includes('авада кедавра') || messageText.includes('авадакедавра')) bot.sendMessage(chatId, `De "sən öl"`, {reply_to_message_id: msg.message_id});
    else if (messageText === '/agilliol' || messageText === '/ağıllı ol') agilliOl(msg, bot);
    else if (messageText.startsWith('а вы рыбов продоете') || messageText.startsWith('а вы рыбов продоёте')) bot.sendMessage(chatId, 'Нет, показываем.', {reply_to_message_id: msg.message_id});
    else if (messageText.startsWith('/azlist')) getAzList(msg, bot);
    
    // for admin group
    else if (messageText.startsWith('/connectto') && isAdmin) connectTo(msg, bot);
    else if (messageText === '/showgroups' && isAdmin) showGroups(chatId, bot);
    else if (messageText === '/adminstartgame' && isAdmin) showYourGroups(chatId, bot, 'Start');
    else if (messageText === '/admindeactivegame' && isAdmin) showYourGroups(chatId, bot, 'Deactive');
    else if (messageText === '/adminshowusers' && isAdmin) showYourGroups(chatId, bot, 'ShowUsers');
    else if (messageText.startsWith('/adminedituser')) adminCommands.editUser(msg, bot);
});

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const chatMember = await bot.getChatMember(chatId, query.from.id);
    const isAdmin = chatMember.status === 'administrator' || chatMember.status === 'creator';

    if (query.data.startsWith('appointment_')) appointmentToTheGame(query, bot);
    else if (query.data.startsWith('notexactly_')) notExactlyAppointment(query, bot);
    else if (query.data.startsWith('decline_')) declineAppointment(query, bot);
    else if (query.data.startsWith('deactivegame_') && isAdmin) deactiveGame(query, bot);
    else if (query.data.startsWith('deactivegame_') && !isAdmin) bot.sendMessage(chatId, 'Бый! Только админ может деактивировать игру', { reply_to_message_id: query.data.message_id });
    else if (query.data.startsWith('selectedGroupForStart_') && isAdmin) startGameInSelectedGroup(query, bot);
    else if (query.data.startsWith('selectedGroupForDeactive_') && isAdmin) showGamesInSelectedGroup(query, bot);
    else if (query.data.startsWith('selectedGroupForShowUsers_') && isAdmin) showGamesInSelectedGroup(query, bot);
});