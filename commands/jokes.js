const moment = require('moment');
const { getGamesTimesFromDatabase } = require('../database');

async function agilliOl(pool, msg, bot) {
    pool.query(`SELECT * FROM users WHERE chat_id = ${msg.chat.id} AND is_guest = FALSE ORDER BY RANDOM() LIMIT 1;`, (err, res) => {
        if (err) {
            console.error(err);
            bot.sendMessage(msg.chat.id, 'Произошла ошибка: ' + err);
            return;
        }
        
        if (res.rows && res.rows[0] && res.rows[0].username) bot.sendMessage(msg.chat.id, `@${res.rows[0].username}, ağıllı ol!`);
    });
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