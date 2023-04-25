async function adminGroupAdd(pool, { chatId, adminChatId, groupName }) {
    try {
        const result = await pool.query(`INSERT INTO admin_groups (chat_id, admin_chat_id, group_name) VALUES ($1, $2, $3);`,
            [chatId, adminChatId, groupName]);

        if (!result) {
            console.error('ADMIN GROUP INSERT RESULT ERROR: ', result);
            throw result;
        } else return;
    } catch (error) {
        console.error('ADMIN GROUP INSERT ERROR: ', error);
        throw error;
    }
}

async function getGroups(pool, adminChatId) {
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

module.exports = {
    adminGroupAdd,
    getGroups
}