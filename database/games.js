const moment = require('moment');

async function getGames(pool, chatId) {
    try {
        const result = await pool.query(`SELECT * FROM games WHERE chat_id = $1 AND status = TRUE`, [chatId]);

        console.log('Get games result: ', JSON.stringify(result));

        if (result && result.rows) {
            return result.rows;
        } else {
            console.log('Get games error');
            return undefined;
        }
    } catch(error) {
        console.error('GET GAME: ', error);
    }
}

async function addGame(pool, chatId, {date, start, end, quote, location, label}) {
    try {
        const result = await pool.query(`INSERT INTO games (game_date, game_starts, game_ends, quote, place, chat_id, status, ` +
            `label) VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7) RETURNING id`, 
            [moment(date, 'DD.MM.YYYY').toISOString(), start, end, quote, location, chatId, label]);

        console.log('Add game result: ', JSON.stringify(result));

        if (result && result.rows && result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            return undefined;
        }
    } catch(error) {
        console.error('ADD GAMES:', error);
    }
}

module.exports = {
    getGames,
    addGame
}