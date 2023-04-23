const moment = require('moment');
const { getGamePlayersFromDataBase, addGuestToDatabase, addGuestToGame, getAzListFromDatabase } = require('../database');

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

async function addGuest(msg, bot) {
    const messageText = msg.text && msg.text.startsWith('/') ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '') : msg.text ? msg.text.toLowerCase() : '';
    const chatId = msg.chat.id;
    const query = messageText.replace('/addguest ', '');
    const parts = query.split('/');
    const gameLabel = parts[0];
    const fullname = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    const exactly = parts.length > 2 && parts[2].includes('*') ? false : true;
    
    const guestOptions = {
        chatId,
        fullname,
        first_name: fullname.split(' ')[0],
        last_name: fullname.split(' ')[1].charAt(0).toUpperCase() + fullname.split(' ')[1].slice(1) || ' '
    }
    
    try {
        const userId = await addGuestToDatabase(guestOptions);

        if (userId) {
            const gameOptions = {
                gameLabel,
                chatId,
                userId,
                exactly
            }
    
            try {
                await addGuestToGame(gameOptions);
    
                bot.sendMessage(chatId, `Вы записали ${fullname} на ${gameLabel}!` + (!exactly ? ' Но это не точно :(' : ''));
            } catch (error) {
                console.error('ADD GUEST TO GAME ERROR: ', error);
            }
        } else {
            console.error('GET GUEST ID ERROR: ', userId);
        }
    } catch (error) {
        console.error('ADD GUEST ERROR', error);
    } 

    
}

async function getAzList(msg, bot) {
    const chatId = msg.chat.id;
    const messageText = msg.text && msg.text.startsWith('/') ? msg.text.toLowerCase().replace('@fortunavolleybalbot', '') :
        msg.text ? msg.text.toLowerCase() : '';

    const gameLabel = messageText.replace('/azlist ', '');

    console.log('gameLabel', gameLabel, messageText);

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

module.exports = {
    getGamePlayers,
    addGuest,
    getAzList
}