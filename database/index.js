const { Pool } = require('pg');
const { addUser, getUsers, addGuest, getRandomUser, getAzList, editUser, getUserChat, getInactiveUsers } = require('./users');
const { addGame, getGames, getGamesTimes, deactiveGame, deleteGame, changeGameLimit } = require('./games');
const { getGamePlayers, addGamePlayerByLabel, addGamePlayerById, removeGamePlayerById, getUndecidedPlayers } = require('./gamePlayers');
const { adminGroupAdd, getGroups } = require('./adminGroup');

// Создаем пулл соединений к базе данных
const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'fortuna',
    password: 'plk_S2%92',
    port: 5432,
});

function addUserToDatabase(msg) {
    const { from: { first_name, last_name, id: userId, username }, chat: { id: chatId } } = msg;
    return addUser(pool, { from: { first_name, last_name, id: userId, username }, chat: { id: chatId } });
}

function getUsersFromDatabase(chatId) {
    return getUsers(pool, chatId);
}

function getUserChatFromDatabase(userId) {
    return getUserChat(pool, userId);
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

function getUndecidedPlayersFromDataBase(chatId) {
    return getUndecidedPlayers(pool, chatId);
}

function addGuestToDatabase(guestOptions) {
    return addGuest(pool, guestOptions);
}

function addGuestToGame(gameOptions) {
    return addGamePlayerByLabel(pool, gameOptions)
}

function getGamesTimesFromDatabase(chatId) {
    return getGamesTimes(pool, chatId);
}

function getRandomUserFromDatabase(chatId) {
    return getRandomUser(pool, chatId);
}

function getAzListFromDatabase(chatId, gameLabel) {
    return getAzList(pool, chatId, gameLabel);
}

function addGroupAdminToDatabase({ chatId, adminChatId, groupName }) {
    return adminGroupAdd(pool, { chatId, adminChatId, groupName });
}

function getGroupsFromDataBase(adminChatId) {
    return getGroups(pool, adminChatId);
}

function addGamePlayerByIdToDatabase({ gameId, chatId, userId, confirmed_attendance }) {
    return addGamePlayerById(pool, { gameId, chatId, userId, confirmed_attendance });
}

function deactiveGameInDatabase(gameId) {
    return deactiveGame(pool, gameId);
}

function deleteGameFromDatabase(gameId) {
    return deleteGame(pool, gameId);
}

function editUserInDatabase({ userId, firstName, lastName, fullnameAz }) {
    return editUser(pool, {userId, firstName, lastName, fullnameAz });
}

function removeGamePlayerByIdFromDatabase({ gameId, chatId, userId }) {
    return removeGamePlayerById(pool, { gameId, chatId, userId });
}

function getInactiveUsersFromDatabase(chatId) {
    return getInactiveUsers(pool, chatId)
}

function changeGameLimitFromDataBase(chatId, {label, limit}) {
    return changeGameLimit(pool, chatId, {label, limit});
}

module.exports = {
    addUserToDatabase,
    getUsersFromDatabase,
    getUserChatFromDatabase,
    addGameToDatabase,
    getGamesFromDatabase,
    getGamePlayersFromDataBase,
    getUndecidedPlayersFromDataBase,
    addGuestToDatabase,
    addGuestToGame,
    getGamesTimesFromDatabase,
    getRandomUserFromDatabase,
    getAzListFromDatabase,
    addGroupAdminToDatabase,
    getGroupsFromDataBase,
    addGamePlayerByIdToDatabase,
    deactiveGameInDatabase,
    deleteGameFromDatabase,
    editUserInDatabase,
    removeGamePlayerByIdFromDatabase,
    getInactiveUsersFromDatabase,
    changeGameLimitFromDataBase
}