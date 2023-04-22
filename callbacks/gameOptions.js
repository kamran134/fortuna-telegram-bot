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

module.exports = {
    deactiveGame
}