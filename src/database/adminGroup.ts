import { Pool } from 'pg';

interface AdminGroup {
    id: number;
    chat_id: number;
    admin_chat_id: number;
    group_name: string;
}

interface AdminGroupOptions {
    chatId: number;
    adminChatId: number;
    groupName: string;
}

export async function adminGroupAdd(pool: Pool, { chatId, adminChatId, groupName }: AdminGroupOptions): Promise<void> {
    try {
        const result = await pool.query(`INSERT INTO admin_groups (chat_id, admin_chat_id, group_name) VALUES ($1, $2, $3);`,
            [chatId, adminChatId, groupName]);

        if (!result) {
            console.error('ADMIN GROUP INSERT RESULT ERROR: ', result);
            throw result;
        }
    } catch (error) {
        console.error('ADMIN GROUP INSERT ERROR: ', error);
        throw error;
    }
}

export async function getGroups(pool: Pool, adminChatId: number): Promise<AdminGroup[]> {
    try {
        const result = await pool.query(`SELECT * FROM admin_groups WHERE admin_chat_id = $1;`, [adminChatId]);

        if (!result || !result.rows || !Array.isArray(result.rows)) {
            console.error('GET GROUPS RESULT ERROR: ', result);
            throw result;
        } else {
            return result.rows;
        }
    } catch (error) {
        console.error('GET GROUPS ERROR: ', error);
        throw error;
    }
} 