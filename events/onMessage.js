import { 
    register, showMenu, getRegistered, startGame, showGames, deactiveGames, getGamePlayers, 
    addGuest, whatTime, agilliOl, getAzList, tagGamePlayers, 
    changeGameLimit, connectTo, showGroups, showYourGroups, addJoke } from "../commands/index.js";
import { editUser } from "../commands/adminCommands.js";
import { saySomethingToInactive, tagUndecidedPlayers } from "../commands/gamePlayers.js";
import { editJoke, listJokes, deleteJoke } from "../commands/jokes.js";

export const onMessage = async (msg, bot) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const user = msg.from;
    const messageText = msg.text && msg.text.startsWith('/') ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '') : msg.text ? msg.text.toLowerCase() : '';
    const chatMember = await bot.getChatMember(chatId, userId);
    const isAdmin = chatMember.status === 'administrator' || chatMember.status === 'creator';

    if (messageText === '/register') register({ chatId, user }, bot);
    else if (messageText === '/menu') showMenu(msg, bot);
    else if (messageText === '/tagregistered') getRegistered(msg, bot, 'tag', isAdmin);
    else if (messageText === '/showregistered') getRegistered(msg, bot, 'show', isAdmin);
    else if (messageText.startsWith('/startgame') && isAdmin) startGame(msg, bot);
    else if (messageText.startsWith('/startgame') && !isAdmin) bot.sendMessage(chatId, 'Только одмэн может создать игру. Be clever!', {reply_to_message_id: msg.message_id});
    else if (messageText === '/showgames') showGames(chatId, bot);
    else if (messageText === '/deletegame') {}
    else if (messageText === '/deactivegame') deactiveGames(msg, bot, isAdmin);
    else if (messageText === 'приффки') bot.sendMessage(chatId, 'ПрИфФкИ, ' + msg.from.first_name + '. КаК дЕлИфФкИ. (Что за ванилька из начала нулевых?)');
    else if (messageText === 'привет') bot.sendMessage(chatId, 'Привет, ' + msg.from.first_name + '. Играть будем?');
    else if (messageText === '/list') getGamePlayers(chatId, bot);
    else if (messageText === 'Пока') bot.sendMessage(chatId, 'До свидания, ' + msg.from.first_name);
    else if (messageText.startsWith('/addguest') && isAdmin) addGuest(msg, bot);
    else if (messageText.startsWith('/addguest') && !isAdmin) bot.sendMessage(chatId, 'Только одмэн может добавлять гостя в игру. Обратитесь к одмэну.');
    else if (messageText.includes('во ск')) whatTime(msg, bot);
    else if (messageText === '/getgroupid' && isAdmin) bot.sendMessage(userId, `ID вашей группы ${chatId}`);
    else if (messageText === '/getgroupid' && !isAdmin) bot.sendMessage(chatId, 'Эта информация не для маглов!');
    else if (messageText === '/алохамора') bot.sendMessage(chatId, `Нет, ${msg.from.first_name}. Это заклинание не откроет тебе двери в админ-панель...`, {reply_to_message_id: msg.message_id});
    else if (messageText.includes('авада кедавра') || messageText.includes('авадакедавра')) bot.sendMessage(chatId, `De "sən öl"`, {reply_to_message_id: msg.message_id});
    else if (messageText === '/agilliol' || messageText === '/ağıllı ol') agilliOl(chatId, bot);
    else if (messageText.startsWith('а вы рыбов продоете') || messageText.startsWith('а вы рыбов продоёте')) bot.sendMessage(chatId, 'Нет, показываем.', {reply_to_message_id: msg.message_id});
    else if (messageText.startsWith('/azlist')) getAzList(msg, bot);
    else if (messageText.toLowerCase().includes('твой бот')) bot.sendMessage(chatId, `Чтоооо? 😳`, { reply_to_message_id: msg.message_id });
    else if (messageText === '/saysomethingtoinactive' && isAdmin) saySomethingToInactive(msg, bot);
    else if (messageText === '/saysomethingtoinactive' && !isAdmin) bot.sendMessage(chatId, 'Только одмэн может отчитывать игроков!');
    else if (messageText === '/deleteplayer' && isAdmin) showGames(chatId, bot, true);
    else if (messageText === '/deleteplayer' && !isAdmin) bot.sendMessage(chatId, 'Только одмэн может удалять игрока из игры. Может вам подойдёт команда /agilliol🤔');
    else if (messageText === '/taggamers') tagGamePlayers(chatId, bot, isAdmin);
    else if (messageText.startsWith('/changelimit') && isAdmin) changeGameLimit(msg, bot);
    else if (messageText.startsWith('/changelimit') && !isAdmin) bot.sendMessage(chatId, 'Я, конечно, всё понимаю, ну кроме квантовой физики и степени твоей наглости 🤨');
    else if (messageText.includes('заткнись')) bot.sendMessage(chatId, 'Не понял! Что за телячьи нежности? 🤨');
    else if ((messageText === 'Бот, растормоши неопределившихся' || messageText === '/tagundecided') && isAdmin) tagUndecidedPlayers(chatId, bot);
    else if ((messageText === 'Бот, растормоши неопределившихся' || messageText === '/tagundecided') && !isAdmin) bot.sendMessage(chatId, 'Только одмэн может пошевелить всех!');

    // for admin group
    else if (messageText.startsWith('/connectto') && isAdmin) connectTo(msg, bot);
    else if (messageText === '/showgroups' && isAdmin) showGroups(chatId, bot);
    else if (messageText === '/adminstartgame' && isAdmin) showYourGroups(chatId, bot, 'Start');
    else if (messageText === '/admindeactivegame' && isAdmin) showYourGroups(chatId, bot, 'Deactive');
    else if (messageText === '/adminshowusers' && isAdmin) showYourGroups(chatId, bot, 'ShowUsers');
    else if (messageText === '/adminsearchuser' && isAdmin) showYourGroups(chatId, bot, 'SearchUser');
    else if (messageText === '/adminshowlastuser' && isAdmin) showYourGroups(chatId, bot, 'ShowLastUser');
    else if (messageText.startsWith('/adminedituser')) editUser(msg, bot);
    else if (messageText === '/adminremoveplayer') tagUndecidedPlayers(chatId, bot);
    else if (messageText.startsWith('/admintaggamers') && isAdmin) showYourGroups(chatId, bot, 'TagGamers');
    else if (messageText === '/adminpaylist') showYourGroups(chatId, bot, 'PayList');
    else if (messageText.startsWith('/adminaddjoke')) addJoke(msg, bot);
    else if (messageText.startsWith('/admindeletejoke')) deleteJoke(msg, bot);
    else if (messageText.startsWith('/adminlistjokes')) listJokes(msg, bot);
    else if (messageText.startsWith('/admineditjoke')) editJoke(msg, bot);
}