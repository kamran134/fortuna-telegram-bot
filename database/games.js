const moment = require('moment');

async function addGame(pool, chatId, {date, start, end, quote, location, label}) {
    try {
        const result = await pool.query(`INSERT INTO games (game_date, game_starts, game_ends, quote, place, chat_id, status, ` +
            `label) VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7) RETURNING id`, 
            [moment(date, 'DD.MM.YYYY').toISOString(), start, end, quote, location, chatId, true, label]);

        console.log('insert result: ', JSON.stringify(result));

        if (result && result.rows > 0) {
            return result.rows[0].id;
        } else {
            return undefined;
        }
    } catch(error) {
        console.error('ADD GAMES:', error);
    }
}

module.exports = {
    addGame
}