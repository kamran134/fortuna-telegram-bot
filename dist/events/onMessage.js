"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessage = void 0;
const commands_1 = require("../commands");
const onMessage = async (msg, bot) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    const user = msg.from;
    const messageText = msg.text && msg.text.startsWith('/')
        ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '')
        : msg.text
            ? msg.text.toLowerCase()
            : '';
    if (!userId || !user)
        return;
    const chatMember = await bot.getChatMember(chatId, userId);
    const isAdmin = chatMember.status === 'administrator' || chatMember.status === 'creator';
    // Convert Telegram user to our User interface
    const ourUser = {
        id: user.id,
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name || undefined,
        username: user.username || undefined,
        language_code: user.language_code || undefined,
        is_bot: user.is_bot
    };
    if (messageText === '/register')
        (0, commands_1.register)({ chatId, user: ourUser }, bot);
    else if (messageText === '/menu')
        (0, commands_1.showMenu)(msg, bot);
    else if (messageText === '/tagregistered')
        (0, commands_1.getRegistered)(msg, bot, 'tag', isAdmin);
    else if (messageText === '/showregistered')
        (0, commands_1.getRegistered)(msg, bot, 'show', isAdmin);
    else if (messageText.startsWith('/startgame') && isAdmin)
        (0, commands_1.startGame)(msg, bot);
    else if (messageText.startsWith('/startgame') && !isAdmin)
        bot.sendMessage(chatId, 'Только одмэн может создать игру. Be clever!', { reply_to_message_id: msg.message_id });
    else if (messageText === '/showgames')
        (0, commands_1.showGames)(chatId, bot);
    else if (messageText === '/deletegame') { }
    else if (messageText === '/deactivegame')
        (0, commands_1.deactiveGames)(msg, bot, isAdmin);
    else if (messageText === 'приффки')
        bot.sendMessage(chatId, 'ПрИфФкИ, ' + user.first_name + '. КаК дЕлИфФкИ. (Что за ванилька из начала нулевых?)');
    else if (messageText === 'привет')
        bot.sendMessage(chatId, 'Привет, ' + user.first_name + '. Играть будем?');
    else if (messageText === '/list')
        (0, commands_1.getGamePlayers)(chatId, bot);
    else if (messageText === 'Пока')
        bot.sendMessage(chatId, 'До свидания, ' + user.first_name);
    else if (messageText.startsWith('/addguest') && isAdmin)
        (0, commands_1.addGuest)(msg, bot);
    else if (messageText.startsWith('/addguest') && !isAdmin)
        bot.sendMessage(chatId, 'Только одмэн может добавлять гостя в игру. Обратитесь к одмэну.');
    else if (messageText.includes('во ск'))
        (0, commands_1.whatTime)(msg, bot);
    else if (messageText === '/getgroupid' && isAdmin)
        bot.sendMessage(userId, `ID вашей группы ${chatId}`);
    else if (messageText === '/getgroupid' && !isAdmin)
        bot.sendMessage(chatId, 'Эта информация не для маглов!');
    else if (messageText === '/алохамора')
        bot.sendMessage(chatId, `Нет, ${user.first_name}. Это заклинание не откроет тебе двери в админ-панель...`, { reply_to_message_id: msg.message_id });
    else if (messageText.includes('авада кедавра') || messageText.includes('авадакедавра'))
        bot.sendMessage(chatId, `De "sən öl"`, { reply_to_message_id: msg.message_id });
    else if (messageText === '/agilliol' || messageText === '/ağıllı ol')
        (0, commands_1.agilliOl)(chatId, bot);
    else if (messageText.startsWith('а вы рыбов продоете') || messageText.startsWith('а вы рыбов продоёте'))
        bot.sendMessage(chatId, 'Нет, показываем.', { reply_to_message_id: msg.message_id });
    else if (messageText.startsWith('/azlist'))
        (0, commands_1.getAzList)(msg, bot);
    else if (messageText.toLowerCase().includes('твой бот'))
        bot.sendMessage(chatId, `Чтоооо? 😳`, { reply_to_message_id: msg.message_id });
    else if (messageText === '/saysomethingtoinactive' && isAdmin)
        (0, commands_1.saySomethingToInactive)(msg, bot);
    else if (messageText === '/saysomethingtoinactive' && !isAdmin)
        bot.sendMessage(chatId, 'Только одмэн может отчитывать игроков!');
    else if (messageText === '/deleteplayer' && isAdmin)
        (0, commands_1.showGames)(chatId, bot, true);
    else if (messageText === '/deleteplayer' && !isAdmin)
        bot.sendMessage(chatId, 'Только одмэн может удалять игрока из игры. Может вам подойдёт команда /agilliol🤔');
    else if (messageText === '/taggamers')
        (0, commands_1.tagGamePlayers)(chatId, bot, isAdmin);
    else if (messageText.startsWith('/changelimit') && isAdmin)
        (0, commands_1.changeGameLimit)(msg, bot);
    else if (messageText.startsWith('/changelimit') && !isAdmin)
        bot.sendMessage(chatId, 'Я, конечно, всё понимаю, ну кроме квантовой физики и степени твоей наглости 🤨');
    else if (messageText.includes('заткнись'))
        bot.sendMessage(chatId, 'Не понял! Что за телячьи нежности? 🤨');
    else if (messageText.startsWith('/sayprivate'))
        (0, commands_1.sayPrivate)(msg, bot);
    else if ((messageText === 'Бот, растормоши неопределившихся' || messageText === '/tagundecided') && isAdmin)
        (0, commands_1.tagUndecidedPlayers)(chatId, bot);
    else if ((messageText === 'Бот, растормоши неопределившихся' || messageText === '/tagundecided') && !isAdmin)
        bot.sendMessage(chatId, 'Только одмэн может пошевелить всех!');
    // for admin group
    else if (messageText.startsWith('/connectto') && isAdmin)
        (0, commands_1.connectTo)(msg, bot);
    else if (messageText === '/showgroups' && isAdmin)
        (0, commands_1.showGroups)(chatId, bot);
    else if (messageText === '/adminstartgame' && isAdmin)
        (0, commands_1.showYourGroups)(chatId, bot, 'Start');
    else if (messageText === '/admindeactivegame' && isAdmin)
        (0, commands_1.showYourGroups)(chatId, bot, 'Deactive');
    else if (messageText === '/adminshowusers' && isAdmin)
        (0, commands_1.showYourGroups)(chatId, bot, 'ShowUsers');
    else if (messageText === '/adminsearchuser' && isAdmin)
        (0, commands_1.showYourGroups)(chatId, bot, 'SearchUser');
    else if (messageText === '/adminshowlastuser' && isAdmin)
        (0, commands_1.showYourGroups)(chatId, bot, 'ShowLastUser');
    else if (messageText.startsWith('/adminedituser'))
        (0, commands_1.editUser)(msg, bot);
    else if (messageText === '/adminremoveplayer')
        (0, commands_1.tagUndecidedPlayers)(chatId, bot);
    else if (messageText.startsWith('/admintaggamers') && isAdmin)
        (0, commands_1.showYourGroups)(chatId, bot, 'TagGamers');
    else if (messageText === '/adminpaylist')
        (0, commands_1.showYourGroups)(chatId, bot, 'PayList');
    else if (messageText.startsWith('/adminaddjoke'))
        (0, commands_1.addJoke)(msg, bot);
    else if (messageText.startsWith('/admindeletejoke'))
        (0, commands_1.deleteJoke)(msg, bot);
    else if (messageText.startsWith('/adminlistjokes'))
        (0, commands_1.listJokes)(msg, bot);
    else if (messageText.startsWith('/admineditjoke'))
        (0, commands_1.editJoke)(msg, bot);
};
exports.onMessage = onMessage;
//# sourceMappingURL=onMessage.js.map