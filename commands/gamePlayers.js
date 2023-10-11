const moment = require('moment');
const { getGamePlayersFromDataBase, addGuestToDatabase, addGuestToGame, getAzListFromDatabase, getInactiveUsersFromDatabase } = require('../database');
const { tagUsers, tagUsersBuCommas } = require('./common');

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
                            username: gamePlayer.username, confirmed_attendance: gamePlayer.confirmed_attendance
                        }],
                        game_date: gamePlayer.game_date,
                        users_limit: gamePlayer.users_limit
                    };
                } else usersByGame[gamePlayer.game_id] = {
                    users: [...usersByGame[gamePlayer.game_id].users, {ind: i, last_name: gamePlayer.last_name,
                        first_name: gamePlayer.first_name, username: gamePlayer.username, confirmed_attendance: gamePlayer.confirmed_attendance}
                    ],
                    game_date: gamePlayer.game_date,
                    users_limit: gamePlayer.users_limit
                };
    
                i++;
            });

            for (const game_id of Object.keys(usersByGame)) {
                if (!game_id) return;

                const placeLeft = usersByGame[game_id].users_limit - usersByGame[game_id].users.length;
                const gameUsersLimit = usersByGame[game_id].users_limit;

                const users = usersByGame[game_id].users.map(user => `${user.ind === (gameUsersLimit + 1) ? '\n--------------Wait list--------------\n' : ''}${user.ind}. ${user.first_name} ${user.last_name}${user.confirmed_attendance ? '' : '*'}`).join('\n');
                const message = `Игра на ${moment(usersByGame[game_id].game_date).format("DD.MM.YYYY")}:\n\n` +
                                `Участники:\n${users}\n\n` +
                                `Осталось мест: ${(placeLeft >= 0 ? placeLeft : 0)}`;

                resultMessage.push(message);
            }

            bot.sendMessage(msg.chat.id, resultMessage.join('\n\n————————————————————————————————\n————————————————————————————————\n\n'));
        }
    } catch (error) {
        console.error('GET GAME PLAYERS SERVICE ERROR', error);
    }
}

async function tagGamePlayers(msg, bot) {
    console.log(msg);
    const chatId = msg.chat.id;
    let resultMessage = '';
    
    try {
        const gamePlayers = await getGamePlayersFromDataBase(chatId);

        if (!gamePlayers || gamePlayers.length === 0) {
            bot.sendMessage(chatId, `Нет записавшихся на игру. Тревожить некого.`);
        } else {
            resultMessage = tagUsersBuCommas(gamePlayers) + `, у одмэна к вам дело, ща напишет. Не перебивайте!`;
            bot.sendMessage(chatId, resultMessage);
        }
    } catch (error) {
        console.error('GET GAME PLAYERS SERVICE ERROR', error);
    }
}

async function addGuest(msg, bot) {
    const messageText = msg.text && msg.text.startsWith('/') ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '') : msg.text ? msg.text.toLowerCase() : '';
    const chatId = msg.chat.id;
    const query = messageText.replace('/addguest ', '');
    const parts = query.split('/');
    const gameLabel = parts[0];
    let fullname;
    
    try {
        fullname = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        
        const confirmed_attendance = parts.length > 2 && parts[2].includes('*') ? false : true;
    
        const guestOptions = {
            chatId,
            fullname,
            first_name: fullname.split(' ')[0],
            last_name: (fullname.split(' ')[1] || '').charAt(0).toUpperCase() + (fullname.split(' ')[1] || '').slice(1) || ' '
        }
        
        try {
            const userId = await addGuestToDatabase(guestOptions);

            if (userId) {
                const gameOptions = {
                    gameLabel,
                    chatId,
                    userId,
                    confirmed_attendance
                }
        
                try {
                    await addGuestToGame(gameOptions);
        
                    bot.sendMessage(chatId, `Вы записали ${fullname} на ${gameLabel}!` + (!confirmed_attendance ? ' Но это не точно :(' : ''));
                } catch (error) {
                    console.error('ADD GUEST TO GAME ERROR: ', error);
                }
            } else {
                console.error('GET GUEST ID ERROR: ', userId);
            }
        } catch (error) {
            console.error('ADD GUEST ERROR', error);
        }
    } catch (error) {
        console.error('Неверный формат! ERROR: ', error);
    }
}

async function getAzList(msg, bot) {
    const chatId = msg.chat.id;
    const messageText = msg.text && msg.text.startsWith('/') ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '') :
        msg.text ? msg.text.toLowerCase() : '';

    const gameLabel = messageText.replace('/azlist ', '');

    try {
        const azList = await getAzListFromDatabase(chatId, gameLabel);

        if (azList && azList.length > 0) {
            azListString = azList.map(user => `${user.fullname_az}`).join('\n');
            bot.sendMessage(chatId, `Azərbaycanca siyahı: \n\n${azListString}`);
        } else {
            bot.sendMessage(chatId, 'Нет игроков на игру');
        }
    } catch (error) {
        console.error('GET AZ LIST ERROR: ', error);
    }
}

async function saySomethingToInactive(msg, bot) {
    const chatId = msg.chat.id;

    try {
        const users = await getInactiveUsersFromDatabase(chatId);

        if (users && users.length > 0) {
            bot.sendMessage(chatId, 'Значит так, \n\n' + tagUsers(users) + '\n\nпочему не посещаем игры? Бот негодуэ 🤨', {parse_mode: 'HTML'});
        }
    } catch (error) {
        console.error('SAY SOMETHING ERROR: ', error);
    }
}

async function getGamePlayersForDelete(msg, bot) {
    const chatId = msg.chat.id;
}

module.exports = {
    getGamePlayers,
    tagGamePlayers,
    getGamePlayersForDelete,
    addGuest,
    getAzList,
    saySomethingToInactive
}