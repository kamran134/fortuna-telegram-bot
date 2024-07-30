const moment = require('moment');
const { getGamesTimesFromDatabase, getRandomUserFromDatabase } = require('../database');

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

module.exports = {
    agilliOl,
    whatTime
}