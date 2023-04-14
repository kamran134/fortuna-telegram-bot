const moment = require('moment');

function appointmentToTheGame(pool, query, bot) {
    const chatId = query.message.chat.id;
    const user = query.from;
    const gameId = query.data.replace('appointment_', '');

    pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, exactly) VALUES ($1, (SELECT id FROM users u WHERE u.chat_id = $2 AND u.user_id = $3), $4, TRUE) ` +
            `ON CONFLICT (user_id, game_id) DO UPDATE SET exactly = TRUE, participate_time = $4 RETURNING (SELECT label FROM games g WHERE g.id = $1);`, 
        [gameId, chatId, user.id, moment(new Date()).toISOString()])
    .then(res => {
        console.log('\n\nappointment res' + JSON.stringify(res) + '\n\n');
        const gameLabel = res.rows[0].label;
        bot.sendMessage(chatId, `@${user.username} вы записались на ${gameLabel}!`)
    })
    .catch(err => console.log('INSERT ERROR___: ', err));
}

function notExactlyAppointment(pool, query, bot) {
    const chatId = query.message.chat.id;
    const user = query.from;
    const gameId = query.data.replace('notexactly_', '');
    
    pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, exactly) VALUES ($1, (SELECT id FROM users u WHERE u.chat_id = $2 AND u.user_id = $3), $4, FALSE) ` +
            `ON CONFLICT (user_id, game_id) DO UPDATE SET exactly = FALSE RETURNING (SELECT label FROM games g WHERE g.id = $1);`, 
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
        `user_id = (SELECT u.id FROM users u WHERE u.user_id = $1 AND u.chat_id = $2) AND game_id = $3 RETURNING (SELECT g.label FROM games g WHERE g.id = 3);`, [user.id, chatId, gameId])
        .then(res => {
            console.log(res);
            if (res.rows.length > 0) {
                const gameLabel = res.rows[0].label;
                bot.sendMessage(chatId, `@${user.username} удирает с игры на ${gameLabel}. Бейте предателя!`);
            } else {
                bot.sendMessage(chatId, `Произошла ошибка при удалении челика из игры. Видимо челик и так не был в игре, но тыкал кнопку`);
            }
        })
        .catch(err => console.log('DELETE ERROR___: ', err));
}

function deactiveGame(pool, query, bot) {
    const gameId = query.data.replace('deactivegame_', '');

    pool.query(`UPDATE games SET status = FALSE WHERE id = $1`, [gameId])
        .then(res => {
            console.log(res);
            bot.sendMessage(chatId, 'Игра закрыта!');
        })
        .catch(err => console.log('UPDATE ERROR___', err));
}

module.exports = {
    appointmentToTheGame,
    notExactlyAppointment,
    declineAppointment,
    deactiveGame
}