const moment = require('moment');

async function getGamePlayers(pool, chatId) {
    try {
        const result = await pool.query(`SELECT users.last_name, users.first_name, users.username, games.game_date, ` +
            `game_users.game_id, game_users.confirmed_attendance, games.users_limit FROM game_users ` +
            `LEFT JOIN users ON users.id = game_users.user_id ` +
            `LEFT JOIN games ON games.id = game_users.game_id ` +
            `WHERE games.chat_id = $1 AND status = TRUE ` +
            `ORDER BY game_users.game_id, users.is_guest, game_users.confirmed_attendance DESC, game_users.participate_time`, [chatId]);

        console.log('Get game players result: ', JSON.stringify(result));

        if (result && result.rows) {
            return result.rows;
        } else {
            console.error('GAME PLAYERS RESULT: ', result);
        }
    } catch (error) {
        console.error('GET GAME PLAYERS: ', error);
        throw error;
    }
}

async function addGamePlayerByLabel(pool, { gameLabel, chatId, userId, confirmed_attendance }) {
    try {
        await pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, confirmed_attendance) ` +
            `VALUES ((SELECT MAX(id) FROM games g WHERE LOWER(g.label) = LOWER($1) AND g.chat_id = $2 AND g.status = TRUE), $3, $4, $5) ` +
            `ON CONFLICT (user_id, game_id) DO NOTHING;`,
            [gameLabel, chatId, userId, moment(new Date()).toISOString(), confirmed_attendance]);
    } catch (error) {
        console.error('ADD GAME PLAYER BY LABEL ERROR: ', error);
        throw error;
    }
}

async function addGamePlayerById(pool, { gameId, chatId, userId, confirmed_attendance }) {
    try {
        const result = await pool.query(`INSERT INTO game_users (game_id, user_id, participate_time, confirmed_attendance) VALUES ($1, (SELECT id FROM users u WHERE u.chat_id = $2 AND u.user_id = $3), $4, $5) ` +
            `ON CONFLICT (user_id, game_id) DO UPDATE SET confirmed_attendance = $5, participate_time = $4 RETURNING (SELECT g.label FROM games g WHERE g.id = $1);`, 
            [gameId, chatId, userId, moment(new Date()).toISOString(), confirmed_attendance]);
        
        if (result && result.rows && Array.isArray(result.rows)) return result.rows[0].label;
        else {
            console.error('ADD GAME PLAYER BY ID RESULT ERROR, ', result);
            return undefined;
        }
    } catch (error) {
        console.error('ADD GAME PLAYER BY ID ERROR', error);
        throw error;
    }
}

async function removeGamePlayerById(pool, { gameId, chatId, userId }) {
    try {
        const result = await pool.query(`DELETE FROM game_users WHERE ` +
            `user_id = (SELECT u.id FROM users u WHERE u.user_id = $1 AND u.chat_id = $2) AND game_id = $3 ` +
            `RETURNING (SELECT g.label FROM games g WHERE g.id = $3);`, [userId, chatId, gameId]);
        
        console.log('REMOVE GAME PLAYER RESULT: ', JSON.stringify(result));
        
        if (result && result.rows && result.rowCount === 0) {
            return undefined;
        } else if (result && result.rows) {
            return result.rows[0].label;
        } else {
            console.error('REMOVE GAME PLAYER RESULT ERROR: ', result);
            throw result;
        }
    } catch (error) {
        console.error('REMOVE GAMER PLAYER ERROR: ', error);
        throw error;
    }
}

module.exports = {
    getGamePlayers,
    addGamePlayerByLabel,
    addGamePlayerById,
    removeGamePlayerById
}