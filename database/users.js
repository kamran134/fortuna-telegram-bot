export async function addUser(pool, { user: { first_name, last_name, id: userId, username }, chatId }) {
    try {
        // check if user already exists
        const checkUser = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (checkUser.rows.length > 0) {
            // we add user to table group_users if not exists
            const checkGroupUser = await pool.query('SELECT * FROM group_users WHERE user_id = $1 AND chat_id = $2', [checkUser.rows[0].id, chatId]);
            console.log('CHECK GROUP USER: ', checkGroupUser.rows.length);
            console.log('CHECK USER: ', checkUser.rows[0]);
            if (checkGroupUser.rows.length === 0) {
                await pool.query(`INSERT INTO group_users (user_id, chat_id, chat_role) VALUES ($1, $2, 'game')`, [checkUser.rows[0].id, chatId]);
            } else {
                console.log('User already exists in group_users', checkGroupUser.rows[0]);
                return `İstifadəçi artıq qrupda var / Пользователь уже существует в группе`;
            }
            // Optionally, you can update the user's information here if needed
            return;
        }
        
        const result = await pool.query(
          'INSERT INTO users (first_name, last_name, user_id, chat_id, username, is_guest, active) VALUES ($1, $2, $3, $4, $5, FALSE, TRUE);',
          [first_name, last_name, userId, chatId, username]
        );

        console.log('ADD USER RESULT: ', result);
        return '✅ Siz uğurla sistemdə qeydiyyatdan keçdiniz / Вы успешно зарегистрировались в системе';
        // if (result && result.rowCount > 0) {
        //     await pool.query('INSERT INTO group_users (user_id, chat_id) VALUES ($1, $2)', [userId, chatId]);
        //     return result.rows[0];
        // }
        // else {
        //     console.error('ADD USER RESULT ERROR: ', result);
        //     throw new Error('Failed to add user to database');
        // }

    } catch (error) {
        console.error('ADDING USERS: ', error);
        throw error;
    }
}

export async function getUsers(pool, chatId) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE chat_id = $1 AND is_guest = FALSE AND active = true ORDER BY id;', [chatId]);
        if (result) {
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

export async function getLastUser(pool, chatId) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE chat_id = $1 AND is_guest = FALSE AND active ORDER BY id DESC LIMIT 1;', [chatId]);
        if (result) {
            if (Array.isArray(result.rows)) return result.rows[0];
            else return undefined;
        }
    } catch (error) {
        console.error('GETTING LAST USER: ', error);
    }
}

export async function searchUser(pool, chatId, searchString) {
    try {
        const query = `
            SELECT * 
            FROM users 
            WHERE chat_id = $1 
              AND is_guest = FALSE 
              AND active 
              AND (first_name ILIKE $2 
                   OR last_name ILIKE $2 
                   OR username ILIKE $2)
            ORDER BY id DESC;
        `;
        const result = await pool.query(query, [chatId, `%${searchString}%`]);
        
        if (result && Array.isArray(result.rows)) {
            return result.rows;
        } else {
            return [];
        }
    } catch (error) {
        console.error('SEARCHING USERS: ', error);
        return [];
    }
}

export async function getAllUsers(pool, chatId) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE chat_id = $1 AND is_guest = FALSE;', [chatId]);
        if (result) {
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

export async function getUserChat(pool, userId) {
    try {
        const result = await pool.query('SELECT chat_id FROM users WHERE id = $1', [userId]);
        if (result) {
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

export async function addGuest(pool, {chatId, first_name, last_name, fullname}) {
    try {
        const result = await pool.query(`INSERT INTO users (user_id, chat_id, is_guest, first_name, last_name, active) VALUES ((SELECT MAX(id) FROM users) + 1, $1, TRUE, $2, $3, TRUE) RETURNING id`,
            [chatId, first_name, last_name]);
        
        if (result && result.rows && Array.isArray(result.rows)) {
            return result.rows[0].id;
        } else {
            console.error('ADD GUEST RESULT ERROR: ', result);
        }
    } catch (error) {
        console.error('ADD GUEST ERROR: ', error);
    }
}

export async function getRandomUser(pool, chatId) {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE chat_id = $1 AND is_guest = FALSE AND active = TRUE ORDER BY RANDOM() LIMIT 1;`, 
            [chatId]);

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

export async function getInactiveUsers(pool, chatId) {
    try {
        const result = await pool.query(`SELECT u.user_id, u.first_name, u.last_name, u.username, COUNT(gu.game_id) AS game_count 
        FROM users u 
        LEFT JOIN game_users gu ON gu.user_id = u.id AND gu.participate_time >= NOW() - INTERVAL '2 months' 
        WHERE u.chat_id = $1 AND u.is_guest = FALSE AND u.active = TRUE 
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

export async function getAzList(pool, chatId, gameLabel) {
    try {
        const result = await pool.query(`SELECT u.fullname_az FROM users u ` +
            `LEFT JOIN game_users gu ON gu.user_id = u.id ` +
            `WHERE u.chat_id = $1 AND gu.game_id = (SELECT MAX(g.id) FROM games g WHERE LOWER(g.label) = LOWER($2));`,
            [chatId, gameLabel]);
        
        if (result && result.rows && Array.isArray(result.rows)) {
            return result.rows;
        } else {
            console.error('GET AZ LIST RESULT ERROR', result);
            throw result;
        }
    } catch (error) {
        console.error('GET AZ LIST ERROR: ', error);
        throw error;
    }
}

export async function editUser(pool, { userId, firstName, lastName, fullnameAz }) {
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

export async function removeUser(pool, chatId, userId) {
    try {
        const result = await pool.query('DELETE FROM users WHERE user_id = $1 AND chat_id = $2', [userId, chatId]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('REMOVE USER ERROR: ', error);
        throw error;
    }
}