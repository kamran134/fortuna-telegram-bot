import moment from 'moment';
import {
    getGamePlayersFromDataBase,
    addGuestToDatabase,
    addGuestToGame,
    getAzListFromDatabase,
    getInactiveUsersFromDatabase,
    getUndecidedPlayersFromDataBase,
    getJokeFromDataBase 
} from '../database/index.js';
import { JokeTypes } from '../common/jokeTypes.js';
import { tagUsers, tagUsersByCommas } from './common.js';
import { skloneniye, skloneniyeAzFull }from '../common/skloneniye.js';

export async function getGamePlayers(chatId, bot) {
    const usersByGame = {};
    const resultMessage = [];

    try {
        const gamePlayers = await getGamePlayersFromDataBase(chatId);

        if (!gamePlayers || gamePlayers.length === 0) {
            bot.sendMessage(chatId, `Oyuna yazılan yoxdur. Dəhşət. \n Нет записавшихся на игру. Капец.`);
        } else {
            let i = 1;

            gamePlayers.forEach(gamePlayer => {
                if (!usersByGame[gamePlayer.game_id]) {
                    i = 1;
                    usersByGame[gamePlayer.game_id] = {
                        users: [{
                            ind: i, last_name: gamePlayer.last_name, first_name: gamePlayer.first_name, 
                            username: gamePlayer.username, confirmed_attendance: gamePlayer.confirmed_attendance,
                            is_guest: gamePlayer.is_guest
                        }],
                        game_date: gamePlayer.game_date,
                        game_starts: gamePlayer.game_starts,
                        game_ends: gamePlayer.game_ends,
                        game_place: gamePlayer.place,
                        game_label: gamePlayer.label,
                        users_limit: gamePlayer.users_limit
                    };
                } else usersByGame[gamePlayer.game_id] = {
                    users: [...usersByGame[gamePlayer.game_id].users, {ind: i, last_name: gamePlayer.last_name, first_name: gamePlayer.first_name, 
                        username: gamePlayer.username, confirmed_attendance: gamePlayer.confirmed_attendance, is_guest: gamePlayer.is_guest }
                    ],
                    game_date: gamePlayer.game_date,
                    game_starts: gamePlayer.game_starts,
                    game_ends: gamePlayer.game_ends,
                    game_place: gamePlayer.place,
                    game_label: gamePlayer.label,
                    users_limit: gamePlayer.users_limit
                };
    
                i++;
            });

            for (const game_id of Object.keys(usersByGame)) {
                if (!game_id) return;

                const placeLeft = usersByGame[game_id].users_limit - usersByGame[game_id].users.length;
                const gameUsersLimit = usersByGame[game_id].users_limit;

                const users = usersByGame[game_id].users.map(user => `${user.ind === (gameUsersLimit + 1) ? '\n--------------Wait list--------------\n' : ''}\t${user.confirmed_attendance ? ' ✅' : ' ❓'} ${user.first_name} ${user.last_name} ${user.is_guest ? '(гость)' : ''}`).join('\n');
                
                const gameDayAz = skloneniyeAzFull(usersByGame[game_id].game_label, 'именительный');
                
                const message = `${gameDayAz.charAt(0).toUpperCase() + gameDayAz.slice(1)} oyunu\n` + 
                    `Игра на ${skloneniye(usersByGame[game_id].game_label, 'винительный')}\n` + 
                    `🗓 Tarix / Дата: ${moment(usersByGame[game_id].game_date).format("DD.MM.YYYY")}\n` +
                    `⏳ Vaxt / Время: ${moment(usersByGame[game_id].game_starts, 'HH:mm:ss').format('HH:mm')} - ${moment(usersByGame[game_id].game_ends, 'HH:mm:ss').format('HH:mm')}\n` +
                    `📍 Məkan / Место: ${usersByGame[game_id].game_place}\n\n` +
                    `👤 İştirakçılar / Участники:\n${users}\n\n` +
                    `⚠️ Qalan yer sayı / Осталось мест: ${(placeLeft >= 0 ? placeLeft : 0)}`;

                resultMessage.push(message);
            }

            bot.sendMessage(chatId, resultMessage.join('\n\n🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸\n\n'));
        }
    } catch (error) {
        console.error('GET GAME PLAYERS SERVICE ERROR', error);
    }
}

export async function tagGamePlayers(chatId, bot, isAdmin) {
    let resultMessage = '';
    
    if (isAdmin) {
        try {
            const gamePlayers = await getGamePlayersFromDataBase(chatId);
    
            if (!gamePlayers || gamePlayers.length === 0) {
                bot.sendMessage(chatId, `Нет записавшихся на игру. Тревожить некого.`);
            } else {
                resultMessage = tagUsersByCommas(gamePlayers) + `, у одмэна к вам дело, ща напишет. Не перебивайте!`;
                bot.sendMessage(chatId, resultMessage, {parse_mode: 'HTML'});
            }
        } catch (error) {
            console.error('GET GAME PLAYERS SERVICE ERROR:', error);
        }
    }
    else {
        try {
            const joke = await getJokeFromDataBase(JokeTypes.TAG_REGISTERED);
            bot.sendMessage(chatId, 'Только одмэн может тегать игроков! ' + joke);
        } catch (error) {
            console.error('GET GAME PLAYERS JOKE ERROR:', error);
        }
    }
}

export async function tagUndecidedPlayers(chatId, bot) {
    let resultMessage = '';
    
    try {
        const gamePlayers = await getUndecidedPlayersFromDataBase(chatId);

        if (!gamePlayers || gamePlayers.length === 0) {
            bot.sendMessage(chatId, `Нет записавшихся на игру. Тревожить некого.`);
        } else {
            resultMessage = tagUsersByCommas(gamePlayers) + `, ну шо, товарищи? Пришло время определиться! Играть будем или нет?`;
            bot.sendMessage(chatId, resultMessage, {parse_mode: 'HTML'});
        }
    } catch (error) {
        console.error('GET GAME PLAYERS SERVICE ERROR', error);
    }
}

export async function addGuest(msg, bot) {
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
        
                    bot.sendMessage(chatId, `Вы записали ${guestOptions.first_name} ${guestOptions.last_name} на ${skloneniye(gameLabel, 'винительный')}!` + (!confirmed_attendance ? ' Но это не точно :(' : ''));
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

export async function getAzList(msg, bot) {
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

export async function saySomethingToInactive(msg, bot) {
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

export async function getGamePlayersForDelete(msg, bot) {
    const chatId = msg.chat.id;
}