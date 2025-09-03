import { CallbackQuery } from 'node-telegram-bot-api';
import moment from "moment";
import { startGame } from "../commands/index.js";
import { deactiveGameInDatabase, getGamesFromDatabase, getGamePlayersFromDataBase, getJokeFromDataBase } from "../database/index.js";
import { tagUsersByCommas } from "../commands/common.js";
import { skloneniye } from "../common/skloneniye.js";
import { JokeTypes } from "../common/jokeTypes.js";

export async function deactiveGame(query: CallbackQuery, bot: any, isAdmin: boolean): Promise<void> {
    const gameIdStr = query.data?.split('_')[1];
    const chatId = query.message?.chat.id;
    const { id, first_name } = query.from;

    if (!gameIdStr || !chatId) return;

    const gameId = parseInt(gameIdStr);
    if (isNaN(gameId)) return;

    if (isAdmin) {
        try {
            const label = await deactiveGameInDatabase(gameId);
    
            if (label) {
                bot.sendMessage(chatId, `Игра на ${skloneniye(label, 'винительный')} закрыта!`);
            } else {
                bot.sendMessage(chatId, 'Кажется, такой игры больше нет');
            }
        } catch (error) {
            console.error('DEACTIVE GAME ERROR: ', error);
        }
    }
    else {
        try {
            let joke = await getJokeFromDataBase(JokeTypes.DEACTIVE_GAME);

            joke = joke.replace('[name]', `<a href="tg://user?id=${id}">${first_name}</a>`);

            bot.sendMessage(chatId, `Только одмэн может закрыть игру. ${joke}`, 
            {
                parse_mode: 'HTML',
                reply_to_message_id: query.message?.message_id
            });
        } catch (error) {
            console.error('DEACTIVE FOR NON ADMIN ERROR: ', error);
        }
    }
}

export async function startGameInSelectedGroup(query: CallbackQuery, bot: any): Promise<void> {
    const adminChatId = query.message?.chat.id;
    const selectedGroupChatIdStr = query.data?.split('_')[1];

    if (!adminChatId || !selectedGroupChatIdStr) return;

    const selectedGroupChatId = parseInt(selectedGroupChatIdStr);
    if (isNaN(selectedGroupChatId)) return;

    bot.sendMessage(adminChatId, 'Введите параметры игры в следующем формате: дата игры (ДД.ММ.ГГГГ)/время начала игры (чч:мм)/время окончания игры (чч:мм)/количество мест/место проведения/название игры');

    let waitForInput = true;

    const messageHandler = async (msg: any) => {
        try {
            if (!waitForInput) {
                return;
            }
            
            if (msg.text === '/cancel' && msg.chat.id === adminChatId) {
                waitForInput = false;
                bot.removeListener('message', messageHandler);
                bot.sendMessage(adminChatId, 'Создание игры отменено!');                
                return;
            }

            // Проверяем, что сообщение пользователя соответствует нужному формату
            const regex = /^(\d{2}\.\d{2}\.\d{4})\/(\d{2}:\d{2})\/(\d{2}:\d{2})\/(\d+)\/([^\/]+)\/([^\/]+)$/;
            const match = msg.text?.match(regex);

            // Если сообщение не соответствует формату, то отправляем пользователю сообщение об ошибке и ждем следующее сообщение от него
            if (msg.chat.id === adminChatId) {
                if (!match) {
                    await bot.sendMessage(adminChatId, 'Формат неверный');
                } else {
                    waitForInput = false;
                    bot.removeListener('message', messageHandler);
                    await startGame({...msg, chat: {...msg.chat, id: selectedGroupChatId}}, bot);
                }
            }
        } catch (error) {
            console.error('CREATE GAME ERROR: ', error);
            bot.sendMessage(adminChatId, 'Произошла ошибка при создании игры');
        }
    };

    bot.on('message', messageHandler);
}

export async function showGamesInSelectedGroup(query: CallbackQuery, bot: any): Promise<void> {
    const adminChatId = query.message?.chat.id;
    const selectedGroupChatIdStr = query.data?.split('_')[1];

    if (!adminChatId || !selectedGroupChatIdStr) return;

    const selectedGroupChatId = parseInt(selectedGroupChatIdStr);
    if (isNaN(selectedGroupChatId)) return;

    let gameDeactiveButtons: any[] = [];

    try {
        const games = await getGamesFromDatabase(selectedGroupChatId);

        if (games && games.length > 0) {
            const gamesString = games.map((game: any, index: number) =>
                `Игра №${(index + 1)}\n` +
                `    🗓Дата: ${moment(game.game_date).format('DD.MM.YYYY')} (${game.label})\n`
            ).join('\n----------------------------------\n');

            gameDeactiveButtons = games.map((game: any) => ({
                text: `Закрыть игру на ${skloneniye(game.label, 'винительный')} (для админов)`,
                callback_data: `deactivegame_${game.id}`
            }));

            bot.sendMessage(adminChatId, gamesString, {
                reply_markup: {
                    inline_keyboard: [gameDeactiveButtons]
                }
            });
        } else {
            bot.sendMessage(adminChatId, 'Ты не можешь деактивировать игру, если активных игр нет');
        }
    } catch (error) {
        console.error('DEACTIVE GAME ERROR', error);
    }
}

export async function tagGamePlayersInSelectedGroup(query: CallbackQuery, bot: any): Promise<void> {
    const adminChatId = query.message?.chat.id;
    const selectedGroupChatIdStr = query.data?.split('_')[1];

    if (!adminChatId || !selectedGroupChatIdStr) return;

    const selectedGroupChatId = parseInt(selectedGroupChatIdStr);
    if (isNaN(selectedGroupChatId)) return;

    bot.sendMessage(adminChatId, 'Введите ваше послание игрокам!');
    let waitForInput = true;

    const messageHandler = async (msg: any) => {
        try {
            if (!waitForInput) {
                return;
            }
            
            if (msg.text === '/cancel' && msg.chat.id === adminChatId) {
                waitForInput = false;
                bot.removeListener('message', messageHandler);
                bot.sendMessage(adminChatId, 'Послание отменено!');                
                return;
            }

            // Если сообщение от админа
            if (msg.chat.id === adminChatId) {
                try {
                    const gamePlayers = await getGamePlayersFromDataBase(selectedGroupChatId);
                    const resultMessage = tagUsersByCommas(gamePlayers) + ', ' + msg.text;
                    waitForInput = false;
                    bot.removeListener('message', messageHandler);
                    bot.sendMessage(selectedGroupChatId, resultMessage, {parse_mode: 'HTML'});
                    return;
                } catch (error) {
                    console.error('GET GAMERS ERROR: ', error);
                }
            }
        } catch (error) {
            console.error('TAG GAMERS ERROR: ', error);
            bot.sendMessage(adminChatId, 'Произошла ошибка при отправке сообщения');
        }
    };

    bot.on('message', messageHandler);
}

export async function showPayListInSelectedGroup(query: CallbackQuery, bot: any): Promise<void> {
    const adminChatId = query.message?.chat.id;
    const selectedGroupChatIdStr = query.data?.split('_')[1];

    if (!adminChatId || !selectedGroupChatIdStr) return;

    const selectedGroupChatId = parseInt(selectedGroupChatIdStr);
    if (isNaN(selectedGroupChatId)) return;

    try {
        const gamePlayers = await getGamePlayersFromDataBase(selectedGroupChatId);

        if (!gamePlayers || gamePlayers.length === 0) {
            bot.sendMessage(adminChatId, `Нет записавшихся на игру. Капец.`);
        } else {
            const usersByGame: Record<string, any> = {};
            const resultMessage: string[] = [];
            let i = 1;

            gamePlayers.forEach((gamePlayer: any) => {
                if (!usersByGame[gamePlayer.game_id]) {
                    i = 1;
                    usersByGame[gamePlayer.game_id] = {
                        users: [{
                            ind: i, 
                            last_name: gamePlayer.last_name, 
                            first_name: gamePlayer.first_name, 
                            username: gamePlayer.username, 
                            confirmed_attendance: gamePlayer.confirmed_attendance,
                            payed: gamePlayer.payed
                        }],
                        game_date: gamePlayer.game_date,
                        game_label: gamePlayer.label,
                        users_limit: gamePlayer.users_limit
                    };
                } else {
                    usersByGame[gamePlayer.game_id] = {
                        users: [...usersByGame[gamePlayer.game_id].users, {
                            ind: i, 
                            last_name: gamePlayer.last_name,
                            first_name: gamePlayer.first_name, 
                            username: gamePlayer.username, 
                            confirmed_attendance: gamePlayer.confirmed_attendance,
                            payed: gamePlayer.payed
                        }],
                        game_date: gamePlayer.game_date,
                        game_label: gamePlayer.label,
                        users_limit: gamePlayer.users_limit
                    };
                }
                i++;
            });

            for (const game_id of Object.keys(usersByGame)) {
                if (!game_id) return;

                const placeLeft = usersByGame[game_id].users_limit - usersByGame[game_id].users.length;
                const gameUsersLimit = usersByGame[game_id].users_limit;

                const users = usersByGame[game_id].users.map(
                    (user: any) => `${user.ind === (gameUsersLimit + 1) ? '\n--------------Wait list--------------\n' : ''}${user.ind}. ${user.first_name} ${user.last_name}${user.payed ? '✅ заплатил' : '❌ НЕ заплатил'}`).join('\n');
                const message = `Игра на ${skloneniye(usersByGame[game_id].game_label, 'винительный')}. ${moment(usersByGame[game_id].game_date).format("DD.MM.YYYY")}:\n\n` +
                                `Участники:\n${users}\n\n` +
                                `Осталось мест: ${(placeLeft >= 0 ? placeLeft : 0)}`;

                resultMessage.push(message);
            }

            bot.sendMessage(adminChatId, resultMessage.join('\n\n————————————————————————————————\n————————————————————————————————\n\n'));
        }
    } catch (error) {
        console.error("Get pay list error: ", error);
    }
}
