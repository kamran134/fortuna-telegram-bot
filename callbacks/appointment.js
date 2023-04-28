const moment = require('moment');
const { addGamePlayerByIdToDatabase } = require('../database');

async function appointmentToTheGame(query, bot) {
    const chatId = query.message.chat.id;
    const user = query.from;
    const gameId = query.data.replace('appointment_', '');

    try {
        const gameLabel = await addGamePlayerByIdToDatabase({ gameId, chatId, userId: user.id });

        if (!gameLabel) {
            bot.sendMessage(chatId, `Пока вы записывались, игра отменилась кажется. Во всяком случае нет такой игры 🫣`);
            return;
        } else {
            bot.sendMessage(chatId, `@${user.username} вы записались на ${gameLabel}!`)
        }
    } catch (error) {
        console.error('APPOINTMENT ERROR: ', error);
    }
}

function notExactlyAppointment(pool, query, bot) {
    const chatId = query.message.chat.id;
    const user = query.from;
    const gameId = query.data.replace('notexactly_', '');
    
    pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, exactly) VALUES ($1, (SELECT id FROM users u WHERE u.chat_id = $2 AND u.user_id = $3), $4, FALSE) ` +
            `ON CONFLICT (user_id, game_id) DO UPDATE SET exactly = FALSE RETURNING (SELECT g.label FROM games g WHERE g.id = $1);`, 
        [gameId, chatId, user.id, moment(new Date()).toISOString()])
        .then(res => {
            console.log(res);
            const gameLabel = res.rows[0].label;
            bot.sendMessage(chatId, `@${user.username}, вы записались на ${gameLabel}! Но это не точно :(`);
        })
        .catch(err => console.log('INSERT ERROR___: ', err));
}

function declineAppointment(pool, query, bot) {
    const chatId = query.message.chat.id;
    const user = query.from;
    const gameId = query.data.replace('decline_', '');

    pool.query(`DELETE FROM game_users WHERE ` +
        `user_id = (SELECT u.id FROM users u WHERE u.user_id = $1 AND u.chat_id = $2) AND game_id = $3 ` +
        `RETURNING (SELECT g.label FROM games g WHERE g.id = $3);`, [user.id, chatId, gameId])
        .then(res => {
            console.log(res);
            if (res.rows.length > 0) {
                const gameLabel = res.rows[0].label;
                bot.sendMessage(chatId, `@${user.username} удирает с игры на ${gameLabel}. Бейте предателя!`);
            } else {
                bot.sendMessage(chatId, `@${user.username} минусует :(`);
            }
        })
        .catch(err => console.log('DELETE ERROR___: ', err));
}

module.exports = {
    appointmentToTheGame,
    notExactlyAppointment,
    declineAppointment
}