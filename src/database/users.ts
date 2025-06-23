import { Pool } from 'pg';
import { User } from '../models/User.js';

interface ChatAndUser {
    user: User;
    chatId: number;
}

interface GuestOptions {
    chatId: number;
    first_name: string;
    last_name: string;
}

interface GameGuestOptions {
    game_id: number;
    first_name: string;
    last_name: string;
}

interface UserEditOptions {
    userId: number;
    firstName?: string;
    lastName?: string;
    fullnameAz?: string;
}

export async function addUser(pool: Pool, { user: { first_name, last_name, id: userId, username }, chatId }: ChatAndUser): Promise<string> {
    try {
        // check if user already exists
        const checkUser = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (checkUser.rows.length > 0) {
            // we add user to table group_users if not exists
            const checkGroupUser = await pool.query('SELECT * FROM group_users WHERE user_id = $1 AND chat_id = $2', [checkUser.rows[0].id, chatId]);
            if (checkGroupUser.rows.length === 0) {
                await pool.query(`INSERT INTO group_users (user_id, chat_id, chat_role) VALUES ($1, $2, 'game')`, [checkUser.rows[0].id, chatId]);
            } else {
                return `İstifadəçi artıq qrupda var / Пользователь уже существует в группе`;
            }
            // Optionally, you can update the user's information here if needed
            return '✅ Siz uğurla qrupa əlavə edildiniz / Вы успешно добавлены в группу';
        }
        
        const result = await pool.query(
          'INSERT INTO users (first_name, last_name, user_id, chat_id, username, is_guest, active) VALUES ($1, $2, $3, $4, $5, FALSE, TRUE) RETURNING id;',
          [first_name, last_name, userId, chatId, username]
        );

        if (result && result.rows && Array.isArray(result.rows)) {
            await pool.query(`INSERT INTO group_users (user_id, chat_id, chat_role) VALUES ($1, $2, 'game')`, [result.rows[0].id, chatId]);
        }
        else {
            console.error('ADD USER RESULT ERROR: ', result);
            throw new Error('Failed to add user to database');
        }

        return '✅ Siz uğurla sistemdə qeydiyyatdan keçdiniz / Вы успешно зарегистрировались в системе';
    } catch (error) {
        console.error('ADDING USERS: ', error);
        throw error;
    }
}

export async function getUsers(pool: Pool, chatId: number): Promise<User[]> {
    try {
        const result = await pool.query(`SELECT * FROM group_users gu 
            LEFT JOIN users u ON gu.user_id = u.id 
            WHERE gu.chat_id = $1 AND u.is_guest = FALSE AND u.active = TRUE ORDER BY gu.user_id;`, [chatId]);

        if (result) {
            if (Array.isArray(result.rows)) return result.rows;
            else return [];
        } else {
            console.error('NOT RESULT');
            throw result;
        }
    } catch (error) {
        console.error('GETTING USERS: ', error);
        throw error;
    }
}

export async function getLastUser(pool: Pool, chatId: number): Promise<User | null> {
    try {
        const result = await pool.query('SELECT * FROM users WHERE chat_id = $1 AND is_guest = FALSE AND active ORDER BY id DESC LIMIT 1;', [chatId]);
        if (result) {
            if (Array.isArray(result.rows)) return result.rows[0];
            else return null;
        }
        return null;
    } catch (error) {
        console.error('GETTING LAST USER: ', error);
        return null;
    }
}

export async function getUserByUsername(pool: Pool, username: string): Promise<User | null> {
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1;', [username]);
        if (result) {
            if (Array.isArray(result.rows)) return result.rows[0];
            else return null;
        }
        return null;
    } catch (error) {
        console.error('GETTING USER BY USERNAME: ', error);
        return null;
    }
}

export async function searchUser(pool: Pool, chatId: number, searchString: string): Promise<User[]> {
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

export async function getAllUsers(pool: Pool, chatId: number): Promise<User[]> {
    try {
        const result = await pool.query('SELECT * FROM users WHERE chat_id = $1 AND is_guest = FALSE;', [chatId]);
        if (result) {
            if (Array.isArray(result.rows)) return result.rows;
            else return [];
        } else {
            console.error('NOT RESULT');
            throw result;
        }
    } catch (error) {
        console.error('GETTING USERS: ', error);
        throw error;
    }
}

export async function getUserChat(pool: Pool, userId: number): Promise<number | null> {
    try {
        const result = await pool.query('SELECT chat_id FROM users WHERE id = $1', [userId]);
        if (result) {
            if (Array.isArray(result.rows)) return result.rows[0]?.chat_id || null;
            else return null;
        } else {
            console.error('NOT RESULT');
            throw result;
        }
    } catch (error) {
        console.error('GET USER CHAT ERROR: ', error);
        throw error;
    }
}

export async function addGuest_old(pool: Pool, { chatId, first_name, last_name }: GuestOptions): Promise<number | null> {
    try {
        const result = await pool.query(`INSERT INTO users (user_id, chat_id, is_guest, first_name, last_name, active) VALUES ((SELECT MAX(id) FROM users) + 1, $1, TRUE, $2, $3, TRUE) RETURNING id`,
            [chatId, first_name, last_name]);

        if (result && result.rows && Array.isArray(result.rows)) {
            return result.rows[0].id;
        } else {
            console.error('ADD GUEST RESULT ERROR: ', result);
            return null;
        }
    } catch (error) {
        console.error('ADD GUEST ERROR: ', error);
        return null;
    }
}

export async function addGuest(pool: Pool, { game_id, first_name, last_name }: GameGuestOptions): Promise<number | null> {
    try {
        const result = await pool.query(`INSERT INTO guests (first_name, last_name, game_id) VALUES ($1, $2, $3) RETURNING id`,
            [first_name, last_name, game_id]);

        if (result && result.rows && Array.isArray(result.rows)) {
            return result.rows[0].id;
        } else {
            console.error('ADD GUEST RESULT ERROR: ', result);
            return null;
        }
    } catch (error) {
        console.error('ADD GUEST ERROR: ', error);
        return null;
    }
}

export async function getRandomUser(pool: Pool, chatId: number): Promise<User | null> {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE chat_id = $1 AND is_guest = FALSE AND active = TRUE ORDER BY RANDOM() LIMIT 1;`, 
            [chatId]);

        if (result && result.rows) {
            return result.rows[0];
        } else {
            console.error('GET RANDOM USER RESULT ERROR: ', result);
            return null;
        }
    } catch (error) {
        console.error('GET RANDOM USER ERROR: ', error);
        throw error;
    }
}

export async function getInactiveUsers(pool: Pool, chatId: number): Promise<User[]> {
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
            return [];
        }
    } catch (error) {
        console.error('GET INACTIVE USERS ERROR: ', error);
        throw error;
    }
}

export async function getAzList(pool: Pool, chatId: number, gameLabel: string): Promise<any[]> {
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

export async function editUser(pool: Pool, { userId, firstName, lastName, fullnameAz }: UserEditOptions): Promise<string> {
    try {
        const updateFields: string[] = [];
        const values: any[] = [];

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

        if (result && result.rows && result.rows.length > 0) {
            return '✅ İstifadəçi məlumatları yeniləndi / Данные пользователя обновлены';
        } else {
            return '❌ İstifadəçi tapılmadı / Пользователь не найден';
        }
    } catch (error) {
        console.error('EDIT USER ERROR: ', error);
        throw error;
    }
}

export async function removeUser(pool: Pool, chatId: number, userId: number): Promise<string> {
    try {
        const result = await pool.query(
            'UPDATE users SET active = FALSE WHERE chat_id = $1 AND user_id = $2 RETURNING *',
            [chatId, userId]
        );

        if (result && result.rows && result.rows.length > 0) {
            return '✅ İstifadəçi sistemdən silindi / Пользователь удален из системы';
        } else {
            return '❌ İstifadəçi tapılmadı / Пользователь не найден';
        }
    } catch (error) {
        console.error('REMOVE USER ERROR: ', error);
        throw error;
    }
} 