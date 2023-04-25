const { startGame } = require("../commands");

async function deactiveGame(pool, query, bot) {
    const gameId = query.data.replace('deactivegame_', '');
    const chatId = query.message.chat.id;

    pool.query(`UPDATE games SET status = FALSE WHERE id = $1`, [gameId])
        .then(res => {
            console.log(res);
            bot.sendMessage(chatId, 'Игра закрыта!');
        })
        .catch(err => console.log('UPDATE GAMES ERROR', err));
}

async function startGameInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    bot.sendMessage(adminChatId, 'Введите параметры игры в следующем формате: дата игры (ДД.ММ.ГГГГ)/время начала игры (чч:мм)/время окончания игры (чч:мм)/количество мест/место проведения/название игры');

    let waitForInput = true;

    bot.once('message', async (msg) => {
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

module.exports = {
    deactiveGame,
    startGameInSelectedGroup
}