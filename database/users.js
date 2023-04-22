async function addUser(pool, {from: {first_name, last_name, id: userId, username}, chat: {id: chatId}}) {
    try {
        const result = await pool.query(
          'INSERT INTO users (first_name, last_name, user_id, chat_id, username, is_guest) VALUES ($1, $2, $3, $4, $5, FALSE);',
          [first_name, last_name, userId, chatId, username]
        );
        console.log(JSON.stringify(result));
        return true;
    } catch (error) {
        console.error('Inserting error', error);
        return false;
    }
}

module.exports = {
    addUser
}