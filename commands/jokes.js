async function agilliOl(pool, msg, bot) {
    pool.query(`SELECT * FROM users WHERE chat_id = ${msg.chat.id} AND is_guest = FALSE ORDER BY RANDOM() LIMIT 1;`, (err, res) => {
        if (err) {
            console.error(err);
            bot.sendMessage(msg.chat.id, 'Произошла ошибка: ' + err);
            return;
        }
        
        if (res.rows && res.rows[0] && res.rows[0].username) bot.sendMessage(msg.chat.id, `@${res.rows[0].username}, ağıllı ol!`);
    });
}

async function whatTime(pool, msg, bot) {
    const chatId = msg.chat.id;
    pool.query(`SELECT game_starts, label FROM games WHERE chat_id = $1 AND status = TRUE`, [chatId])
        .then(res => {
            console.log('What time res: ', JSON.stringify(res));
            
            const gameTimes = res.rows.map(row => `${row.label}: ${row.game_starts}`).join(', ');

            bot.sendMessage(chatId, `Мэээх. Сколько можно спрашивать? :/\n${gameTimes}`);
        })
        .catch(err => console.error('What time error: ', err))
}

module.exports = {
    agilliOl,
    whatTime
}