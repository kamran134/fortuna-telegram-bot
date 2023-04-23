const { Pool } = require('pg');
const { addUser, getUsers, addGuest } = require('./users');
const { addGame, getGames } = require('./games');
const { getGamePlayers, addGamePlayerByLabel } = require('./gamePlayers');

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

function getUsersFromDatabase(chatId) {
    return getUsers(pool, chatId);
}

function addGameToDatabase(chatId, gameOptions) {
    return addGame(pool, chatId, gameOptions);
}

function getGamesFromDatabase(chatId) {
    return getGames(pool, chatId);
}

function getGamePlayersFromDataBase(chatId) {
    return getGamePlayers(pool, chatId);
}

function addGuestToDatabase(guestOptions) {
    return addGuest(pool, guestOptions);
}

function addGuestToGame(gameOptions) {
    return addGamePlayerByLabel(pool, gameOptions)
}

module.exports = {
    addUserToDatabase,
    getUsersFromDatabase,
    addGameToDatabase,
    getGamesFromDatabase,
    getGamePlayersFromDataBase,
    addGuestToDatabase,
    addGuestToGame
}