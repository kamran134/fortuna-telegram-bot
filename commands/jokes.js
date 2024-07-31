const moment = require('moment');
const { getGamesTimesFromDatabase, getRandomUserFromDatabase, addJokeToDataBase } = require('../database');

async function agilliOl(msg, bot) {
    const chatId = msg.chat.id;

    try {
        const randomUser = await getRandomUserFromDatabase(chatId);

        if (randomUser) {
            bot.sendMessage(chatId, `@${randomUser.username ? randomUser.username :
                '<a href="tg://user?id=${user.user_id}">' + randomUser.first_name + '</a>'}, ağıllı ol! 🧠`,
                {parse_mode: 'HTML'});
        } else {
            bot.sendMessage(chatId, 'Печально, когда некому говорить "Ağıllı ol" 🥲');
        }
    } catch (error) {
        console.error('AGILLI OL ERROR: ', error);
    }
}

async function whatTime(msg, bot) {
    const chatId = msg.chat.id;

    try {
        const gamesTimes = await getGamesTimesFromDatabase(chatId);

        if (gamesTimes && gamesTimes.length > 0) {
            const gamesTimesString = gamesTimes.map(game => `${game.label}: ${moment(game.game_starts, 'HH:mm:ss').format('HH:mm')}`).join(', ');
            bot.sendMessage(chatId, `Мэээх. Сколько можно спрашивать? 😒\n${gamesTimesString}`);
        }
    } catch (error) {
        console.error('WHAT TIME ERROR: ', error);
    }
}

async function addJoke(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId === 963292126 || userId === 112254199) {
        try {
            const parts = msg.text.replace('/adminaddjoke ', '').split('/');
            if (parts.length == 2) {
                const [joke, jokeType] = parts;
                await addJokeToDataBase(joke, jokeType);
    
                bot.sendMessage(chatId, `Ваша гениальная "шутка" добавлена в базу данных. Полюбуйтесь на неё ещё раз: ${joke}`);
            } else {
                bot.sendMessage(chatId, `Дед, ты что-то напортачил. Вот какой формат: /adminaddjoke [шутка]/[номер категории шутки]`);
            }
            
        } catch (error) {
            bot.sendMessage(chatId, `Ваша гениальная "шутка" не добавилась. Возможно она слишком тупая. А возможно возникла вот такая ошибка: ${error}`);
        }
    } else {
        bot.sendMessage(chatId, `Такую ответственную работу, как пополнить базу шутками мы могли доверить только истинным юмористам. Поэтому никто кроме создателей бота не могут увлекаться этим!`);
    }
}

module.exports = {
    agilliOl,
    whatTime,
    addJoke
}