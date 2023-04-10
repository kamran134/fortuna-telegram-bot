const TelegramBot = require('node-telegram-bot-api');

// Устанавливаем токен, который вы получили от BotFather
const token = '5853539307:AAGIfxr3O_mu-uN07fqYCirWzxTHs-UqrJY';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Слушаем сообщения
bot.on('message', (msg) => {
    const users = [];

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
        if (!users.some(user => user.id === msg.from.id)) {
            users.push({id: msg.from.id, fullname: msg.from.first_name + ' ' + msg.from.last_name});
        }
        // bot.sendMessage(msg.chat.id, users.map((user, index) => (index+1) + ". " + user.fullname).join('\n'));
    }

    if (msg.text === '-' || msg.text.toLowerCase() === 'минус' || msg.text.toLowerCase() === 'minus') {
        bot.sendMessage(msg.chat.id, 'Это будет сложно, но как-нибудь выживем без тебя, ' + msg.from.first_name);
        users = users.filter(user => user.id !== msg.from.id);
        bot.sendMessage(msg.chat.id, users.filter(user => user.id !== msg.from.id).map((user, index) => (index+1) + ". " + user.fullname).join('\n'));
    }

    if (msg.text.toLowerCase() === '\/список') {
        bot.sendMessage(msg.chat.id, users.map((user, index) => (index+1) + ". " + user.fullname).join('\n'));
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