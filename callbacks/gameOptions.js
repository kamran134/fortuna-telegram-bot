const moment = require("moment");
const { startGame, deactiveGames } = require("../commands");
const { deactiveGameInDatabase, getGamesFromDatabase } = require("../database");

async function deactiveGame(query, bot) {
    const gameId = query.data.split('_')[1];
    const chatId = query.message.chat.id;

    try {
        const label = await deactiveGameInDatabase(gameId);

        if (label) {
            bot.sendMessage(chatId, `Игра закрыта (${label})!`);
        } else {
            bot.sendMessage(chatId, 'Кажется, такой игры больше нет');
        }
    } catch (error) {
        console.error('DEACTIVE GAME ERROR: ', error);
    }
}

async function startGameInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    bot.sendMessage(adminChatId, 'Введите параметры игры в следующем формате: дата игры (ДД.ММ.ГГГГ)/время начала игры (чч:мм)/время окончания игры (чч:мм)/количество мест/место проведения/название игры');

    let waitForInput = true;

    bot.on('message', async (msg) => {
        try {
            if (!waitForInput) {
                return;
            }
            
            if (msg.text === '/cancel') {
                waitForInput = false;
                bot.sendMessage(adminChatId, 'Создание игры отменено!');                
                return;
            }

            // Проверяем, что сообщение пользователя соответствует нужному формату
            const regex = /^(\d{2}\.\d{2}\.\d{4})\/(\d{2}:\d{2})\/(\d{2}:\d{2})\/(\d+)\/([^\/]+)\/([^\/]+)$/;
            const match = msg.text.match(regex);

            // Если сообщение не соответствует формату, то отправляем пользователю сообщение об ошибке и ждем следующее сообщение от него
            if (!match) {
                await bot.sendMessage(adminChatId, 'Формат неверный');
            } else {
                waitForInput = false;
                await startGame({...msg, chat: {...msg.chat, id: selectedGroupChatId}}, bot);
            }
        } catch (error) {
            console.log('CREATE GAME ERROR: ', error);
            bot.sendMessage(adminChatId, 'Произошла ошибка при создании игры');
        }
    });
}

async function showGamesInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    let gameDeactiveButtons = [];

    try {
        const games = await getGamesFromDatabase(selectedGroupChatId);

        if (games && games.length > 0) {
            const gamesString = games.map((game, index) =>
                `Игра №${(index + 1)}\n` +
                `    Дата: ${moment(game.game_date).format('DD.MM.YYYY')} (${game.label})\n`
            ).join('\n----------------------------------\n');

            gameDeactiveButtons = games.map(game => ({
                text: `Закрыть игру на ${game.label} (для админов)`,
                callback_data: `deactivegame_${game.id}`}));

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

    // try {
    //     await deactiveGames({chat: {id: selectedGroupChatId}}, bot);
    // } catch (error) {
    //     console.error("SHOW GAMES ERROR: ", error);
    //     throw error;
    // }
}

module.exports = {
    deactiveGame,
    startGameInSelectedGroup,
    showGamesInSelectedGroup
}