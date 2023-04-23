const moment = require('moment');

async function getGamePlayers(pool, chatId) {
    try {
        const result = await pool.query(`SELECT users.last_name, users.first_name, users.username, games.game_date, ` +
            `game_users.game_id, game_users.exactly, games.quote FROM game_users ` +
            `LEFT JOIN users ON users.id = game_users.user_id ` +
            `LEFT JOIN games ON games.id = game_users.game_id ` +
            `WHERE games.chat_id = $1 AND status = TRUE ` +
            `ORDER BY game_users.game_id, users.is_guest, game_users.exactly DESC, game_users.participate_time`, [chatId]);

        console.log('Get game players result: ', JSON.stringify(result));

        if (result && result.rows) {
            return result.rows;
        } else {
            console.error('GAME PLAYERS RESULT: ', result);
        }
    } catch (error) {
        console.error('GET GAME PLAYERS: ', error);
    }
}

async function addGamePlayerByLabel(pool, { gameLabel, chatId, userId, exactly }) {
    try {
        await pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, exactly) ` +
            `VALUES ((SELECT MAX(id) FROM games g WHERE g.label = $1 AND g.chat_id = $2 AND g.status = TRUE), $3, $4, $5) ` +
            `ON CONFLICT (user_id, game_id) DO NOTHING;`, 
            [gameLabel, chatId, userId, moment(new Date()).toISOString(), exactly]);
    } catch (error) {
        console.error('ADD GAME PLAYER BY LABEL ERROR: ', error)
    }
}

module.exports = {
    getGamePlayers,
    addGamePlayerByLabel
}