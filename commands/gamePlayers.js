const moment = require('moment');

function getGamePlayers(pool, msg, bot) {
    const chatId = msg.chat.id;

    console.log('chatId', chatId);

    pool.query(`SELECT users.last_name, users.first_name, users.username, games.game_date, game_users.game_id, game_users.exactly, games.quote FROM game_users ` +
        `LEFT JOIN users ON users.id = game_users.user_id ` +
        `LEFT JOIN games ON games.id = game_users.game_id ` +
        `WHERE games.chat_id = ${chatId} AND status = TRUE ` +
        `ORDER BY game_users.game_id, users.is_guest, game_users.exactly DESC, game_users.participate_time`, (err, res) => {

        if (err) {
            console.error(err);
            bot.sendMessage(chatId, 'Произошла ошибка: ' + err);
            return;
        }

        const usersByGame = {};
        const resultMessage = [];

        let i = 1;

        res.rows.forEach(row => {
            if (!usersByGame[row.game_id]) {
                i = 1;
                usersByGame[row.game_id] = {
                    users: [{
                        ind: i, last_name: row.last_name, first_name: row.first_name, username: row.username, exactly: row.exactly
                    }],
                    game_date: row.game_date,
                    quote: row.quote
                };
            } else usersByGame[row.game_id] = {
                users: [...usersByGame[row.game_id].users, {ind: i, last_name: row.last_name, first_name: row.first_name, username: row.username, exactly: row.exactly}],
                game_date: row.game_date,
                quote: row.quote
            };

            i++;
        });

        if (Object.keys(usersByGame).length === 0) {
            bot.sendMessage(msg.chat.id, 'Нет записавшихся на игру. Капец.');
        } else {
            for (const game_id of Object.keys(usersByGame)) {
                if (!game_id) return;

                const placeLeft = usersByGame[game_id].quote - usersByGame[game_id].users.length;
                const gameQuote = usersByGame[game_id].quote;

                const users = usersByGame[game_id].users.map(user => `${user.ind === (gameQuote + 1) ? '\n--------------Wait list--------------\n' : ''}${user.ind}. ${user.first_name} ${user.last_name}${user.exactly ? '' : '*'}`).join('\n');
                const message = `Игра на ${moment(usersByGame[game_id].game_date).format("DD.MM.YYYY")}:\n\n` +
                                `Участники:\n${users}\n\n` +
                                `Осталось мест: ${(placeLeft >= 0 ? placeLeft : 0)}`;

                resultMessage.push(message);
            }

            bot.sendMessage(msg.chat.id, resultMessage.join('\n////////////////////////////////\n'));
        }
    });
}

function addGuest(pool, msg, bot) {
    const messageText = msg.text && msg.text.startsWith('/') ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '') : msg.text ? msg.text.toLowerCase() : '';
    const chatId = msg.chat.id;
    const query = messageText.replace('/addguest ', '');
    const parts = query.split('/');

    const gameLabel = parts[0];
    const fullname = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    const first_name = fullname.split(' ')[0];
    const last_name = fullname.split(' ')[1] | ' ';
    const exactly = parts.length > 2 && parts[2].includes('*') ? false : true;
    let userId = 0;

    pool.query(`INSERT INTO users (user_id, chat_id, is_guest, guest_name, first_name, last_name) VALUES ((SELECT MAX(id) FROM users) + 1, $1, TRUE, $2, $3, $4) RETURNING id`,
        [chatId, fullname, first_name, last_name])
        .then(res => {
            console.log('Insert guest res: ', JSON.stringify(res));
            userId = res.rows[0].id;

            if (userId > 0) {
                pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, exactly) VALUES ((SELECT MAX(id) FROM games g WHERE g.label = $1 AND g.chat_id = $2 AND g.status = TRUE), $3, $4, $5) ` +
                    `ON CONFLICT (user_id, game_id) DO NOTHING;`, 
                [gameLabel, chatId, userId, moment(new Date()).toISOString(), exactly])
                    .then(res => {
                        console.log(res);
                        bot.sendMessage(chatId, `Вы записали ${fullname} на ${gameLabel}!` + (!exactly ? ' Но это не точно :(' : ''))
                    })
                    .catch(err => console.log('INSERT GUEST TO GAME ERROR: ', err));
            }
        })
        .catch(err => console.error('INSERT GUEST TO USERS ERROR: ', err));
}

module.exports = {
    getGamePlayers,
    addGuest
}