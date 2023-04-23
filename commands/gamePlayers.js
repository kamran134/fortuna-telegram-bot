const moment = require('moment');
const { getGamePlayersFromDataBase } = require('../database');

async function getGamePlayers(msg, bot) {
    const chatId = msg.chat.id;

    const usersByGame = {};
    const resultMessage = [];

    try {
        const gamePlayers = await getGamePlayersFromDataBase(chatId);

        if (!gamePlayers || gamePlayers.length === 0) {
            bot.sendMessage(chatId, `Нет записавшихся на игру. Капец.`);
        } else {
            let i = 1;

            gamePlayers.forEach(gamePlayer => {
                if (!usersByGame[gamePlayer.game_id]) {
                    i = 1;
                    usersByGame[gamePlayer.game_id] = {
                        users: [{
                            ind: i, last_name: gamePlayer.last_name, first_name: gamePlayer.first_name, 
                            username: gamePlayer.username, exactly: gamePlayer.exactly
                        }],
                        game_date: gamePlayer.game_date,
                        quote: gamePlayer.quote
                    };
                } else usersByGame[gamePlayer.game_id] = {
                    users: [...usersByGame[gamePlayer.game_id].users, {ind: i, last_name: gamePlayer.last_name,
                        first_name: gamePlayer.first_name, username: gamePlayer.username, exactly: gamePlayer.exactly}
                    ],
                    game_date: gamePlayer.game_date,
                    quote: gamePlayer.quote
                };
    
                i++;
            });

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
    } catch (error) {
        console.error('GET GAME PLAYERS SERVICE ERROR', error);
    }
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