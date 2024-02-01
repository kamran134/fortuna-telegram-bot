const moment = require('moment');

async function getGames(pool, chatId) {
    try {
        const result = await pool.query(`SELECT * FROM games WHERE chat_id = $1 AND status = TRUE;`, [chatId]);

        console.log('Get games result: ', JSON.stringify(result));

        if (result && result.rows) {
            return result.rows;
        } else {
            console.log('Get games error');
            return undefined;
        }
    } catch(error) {
        console.error('GET GAME: ', error);
        throw error;
    }
}

async function getGamesTimes(pool, chatId) {
    try {
        const result = await pool.query(`SELECT game_starts, label FROM games WHERE chat_id = $1 AND status = TRUE;`, [chatId]);

        console.log('Get games times result: ', JSON.stringify(result));

        if (result && result.rows && Array.isArray(result.rows)) {
            return result.rows;
        } else {
            console.error('GET GAMES TIMES RESULT ERROR', result);
        }
    } catch (error) {
        console.log('GET GAMES TIMES ERROR: ', error);
        throw error;
    }
}

async function addGame(pool, chatId, {date, start, end, users_limit, location, label}) {
    try {
        const result = await pool.query(`INSERT INTO games (game_date, game_starts, game_ends, users_limit, place, chat_id, status, ` +
            `label) VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7) ON CONFLICT(chat_id, game_date, label) DO NOTHING RETURNING id;`, 
            [moment(date, 'DD.MM.YYYY').toISOString(), start, end, users_limit, location, chatId, label]);

        console.log('Add game result: ', JSON.stringify(result));

        if (result && result.rows && result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            return undefined;
        }
    } catch(error) {
        console.error('ADD GAMES:', error);
        throw error;
    }
}

async function deactiveGame(pool, gameId) {
    const client = await pool.connect();

    try {
        const result = await client.query(`UPDATE games SET status = FALSE WHERE id = $1 RETURNING label;`, [gameId]);

        if (result && result.rows && Array.isArray(result.rows)) {
            return result.rows[0].label;
        } else {
            console.error('DEACTIVE GAME RESULT ERROR: ', error);
            throw result;
        }
    } catch (error) {
        console.error('DEACTIVE GAME ERROR: ', error);
        throw error;
    } finally {
        client.release();
    }
}

async function deleteGame(pool, gameId) {
    const client = await pool.connect();

    try {
        // Удаляем связанные строки в таблице game_users
        await client.query(`DELETE FROM game_users WHERE game_id = $1;`, [gameId]);

        // Удаляем игру из таблицы games
        const result = await client.query(`DELETE FROM games WHERE id = $1 RETURNING label;`, [gameId]);

        if (result && result.rows && Array.isArray(result.rows)) {
            return result.rows[0].label;
        } else {
            console.error('DEACTIVE GAME RESULT ERROR: ', error);
            throw result;
        }
    } catch (error) {
        console.error('DEACTIVE GAME ERROR: ', error);
        throw error;
    } finally {
        client.release();
    }
}

async function changeGameLimit(pool, chatId, {label, limit}) {
    const client = await pool.connect();

    try {
        const result = await client.query(`UPDATE games SET users_limit = $1 WHERE chat_id = $2 AND label = $3 RETURNING label;`, [limit, chatId, label]);
        
        if (result && result.rows && Array.isArray(result.rows)) {
            return result.rows[0].label;
        } else {
            console.error('CHANGE GAME LIMIT RESULT ERROR');
            throw result;
        }
    } catch (er) {
        console.error('CHANGE GAME LIMIT IN DATABASE ERROR: ', er);
        throw er;
    } finally {
        client.release();
    }
}

async function checkGameStatus(pool, gameId) {
    const client = await pool.connect();

    try {
        const result = await client.query(`SELECT status FROM games WHERE id = $1;`, [gameId]);

        if (result && result.rows && Array.isArray(result.rows)) {
            return result.rows[0].status;
        } else {
            console.error('THAT IS NOT ARRAY');
        }
    } catch (e) {
        console.error('CHECK GAME STATUS RESULT ERROR: ', e);
    }
}

module.exports = {
    getGames,
    addGame,
    getGamesTimes,
    deactiveGame,
    deleteGame,
    changeGameLimit,
    checkGameStatus
}