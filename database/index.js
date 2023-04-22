const { Pool } = require('pg');
const { addUser, getUsers } = require('./users');

// Создаем пулл соединений к базе данных
const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'fortuna',
    password: 'postgres',
    port: 5432,
});

function addUserToDatabase(msg) {
    const { from: { first_name, last_name, id: userId, username }, chat: { id: chatId } } = msg;
    return addUser(pool, { from: { first_name, last_name, id: userId, username }, chat: { id: chatId } });
}

function getUsersFromDatabase(msg) {
    const { chat: { id: chatId }} = msg;
    return getUsers(pool, { chat: { id: chatId } });
}

module.exports = {
    addUserToDatabase,
    getUsersFromDatabase
}