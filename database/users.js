async function addUser(pool, {from: {first_name, last_name, id: userId, username}, chat: {id: chatId}}) {
    try {
        const result = await pool.query(
          'INSERT INTO users (first_name, last_name, user_id, chat_id, username, is_guest) VALUES ($1, $2, $3, $4, $5, FALSE);',
          [first_name, last_name, userId, chatId, username]
        );
        console.log(JSON.stringify(result));
    } catch (error) {
        console.error('ADD USERS:', error);
        throw error;
    }
}

async function getUsers(pool, chatId) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE chat_id = $1 AND is_guest = FALSE;', [chatId]);
        if (result) {
            console.log('RESULT: ', JSON.stringify(result));

            if (Array.isArray(result.rows)) return result.rows;
            else return undefined;
        } else {
            console.error('NOT RESULT');
            throw result;
        }
    } catch (error) {
        console.error('GETTING USERS: ', error);
        throw error;
    }
}

async function getUserChat(pool, userId) {
    try {
        console.log('\n\n\nuserID\n', userId, '\n\n\n');
        
        const result = await pool.query('SELECT chat_id FROM users WHERE id = $1', [userId]);
        if (result) {
            console.log('RESULT: ', JSON.stringify(result));

            if (Array.isArray(result.rows)) return result.rows[0];
            else return undefined;
        } else {
            console.error('NOT RESULT');
            throw result;
        }
    } catch (error) {
        console.error('GET USER CHAT ERROR: ', error);
        throw error;
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
        console.error('GET RANDOM USER ERROR: ', error);
        throw error;
    }
}

async function getInactiveUsers(pool, chatId) {
    try {
        const result = await pool.query(`SELECT u.user_id, u.first_name, u.last_name, u.username, COUNT(gu.game_id) AS game_count
        FROM users u
        LEFT JOIN game_users gu ON gu.user_id = u.id AND gu.participate_time >= NOW() - INTERVAL '2 months'
        WHERE u.chat_id = $1 AND u.is_guest = FALSE
        GROUP BY u.user_id, u.first_name, u.last_name, u.username
        HAVING COUNT(gu.game_id) < 2
        ORDER BY game_count ASC;`, [chatId]);

        if (result && result.rows.length > 0) return result.rows; 
        else {
            console.error('THIS CHAT HAS NO GAME USERS');
            return undefined;
        }
    } catch (error) {
        console.error('GET INACTIVE USERS ERROR: ', error);
        throw error;
    }
}

async function getAzList(pool, chatId, gameLabel) {
    try {
        const result = await pool.query(`SELECT u.fullname_az FROM users u ` +
            `LEFT JOIN game_users gu ON gu.user_id = u.id ` +
            `WHERE u.chat_id = $1 AND gu.game_id = (SELECT MAX(g.id) FROM games g WHERE LOWER(g.label) = LOWER($2));`,
            [chatId, gameLabel]);
        
        console.log('Get az list result', JSON.stringify(result));

        if (result && result.rows && Array.isArray(result.rows)) {
            return result.rows;
        } else {
            console.log('GET AZ LIST RESULT ERROR', result);
            throw result;
        }
    } catch (error) {
        console.error('GET AZ LIST ERROR: ', error);
        throw error;
    }
}

async function editUser(pool, { userId, firstName, lastName, fullnameAz }) {

    console.log('\n\nuserId', userId, 'firstName', firstName, 'lastName', lastName, 'fullnameAz', fullnameAz, '\n\n');

    try {
        const updateFields = [];
        const values = [];

    if (firstName) {
        updateFields.push('first_name = $1');
        values.push(firstName);
    }

    if (lastName) {
        updateFields.push('last_name = $2');
        values.push(lastName);
    }
  
    if (fullnameAz) {
        updateFields.push('fullname_az = $3');
        values.push(fullnameAz);
    }

    const setClause = updateFields.join(', ');
    values.push(userId);
  
    const result = await pool.query(
        `UPDATE users SET ${setClause} WHERE id = $${values.length} RETURNING *`,
        values
    );
  
      return result.rows[0];
    } catch (error) {
      console.error('EDIT USER ERROR: ', error);
      throw error;
    }
}

module.exports = {
    addUser,
    getUsers,
    getUserChat,
    addGuest,
    getRandomUser,
    getInactiveUsers,
    getAzList,
    editUser
}