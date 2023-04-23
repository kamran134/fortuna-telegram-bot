async function addUser(pool, {from: {first_name, last_name, id: userId, username}, chat: {id: chatId}}) {
    try {
        const result = await pool.query(
          'INSERT INTO users (first_name, last_name, user_id, chat_id, username, is_guest) VALUES ($1, $2, $3, $4, $5, FALSE);',
          [first_name, last_name, userId, chatId, username]
        );
        console.log(JSON.stringify(result));
        return true;
    } catch (error) {
        console.error('ADD USERS:', error);
        return false;
    }
}

async function getUsers(pool, chatId) {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE chat_id = ${chatId} AND is_guest = FALSE;`);
        if (result) {
            console.log('RESULT: ', JSON.stringify(result));
            if (Array.isArray(result.rows)) return result.rows;
            else return undefined;
        } else {
            console.error('NOT RESULT');
        }
    } catch (error) {
        console.error('GETTING USERS: ', error);
    }
}

async function addGuest(pool, {chatId, first_name, last_name, fullname}) {
    try {
        const result = await pool.query(`INSERT INTO users (user_id, chat_id, is_guest, guest_name, first_name, last_name) VALUES ((SELECT MAX(id) FROM users) + 1, $1, TRUE, $2, $3, $4) RETURNING id`,
            [chatId, fullname, first_name, last_name]);

        console.log('Add guest result: ', JSON.stringify(result));
        
        if (result && result.rows && Array.isArray(result.rows)) {
            return result.rows[0].id;
        } else {
            console.error('ADD GUEST RESULT ERROR: ', result);
        }
    } catch (error) {
        console.error('ADD GUEST ERROR: ', error);
    }
}

async function getRandomUser(pool, chatId) {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE chat_id = $1 AND is_guest = FALSE ORDER BY RANDOM() LIMIT 1;`, 
            [chatId]);

        console.log('Get random user result: ', JSON.stringify(result));

        if (result && result.rows) {
            return result.rows[0];
        } else {
            console.error('GET RANDOM USER RESULT ERROR: ', result);
        }
    } catch (error) {
        console.log('GET RANDOM USER ERROR: ', error);
        throw error;
    }
}

module.exports = {
    addUser,
    getUsers,
    addGuest,
    getRandomUser
}