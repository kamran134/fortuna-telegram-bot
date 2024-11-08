const { Pool } = require('pg');
const { addUser, getUsers, getLastUser, searchUser, addGuest, getRandomUser, getAzList, editUser, getUserChat, getInactiveUsers } = require('./users');
const { addGame, getGames, getGamesTimes, deactiveGame, deleteGame, changeGameLimit, checkGameStatus } = require('./games');
const { getGamePlayers, addGamePlayerByLabel, addGamePlayerById, removeGamePlayerById, getUndecidedPlayers } = require('./gamePlayers');
const { adminGroupAdd, getGroups } = require('./adminGroup');
const { getJoke, addJoke, deleteJoke, getJokes, updateJoke } = require('./jokes');

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

function getLastUserFromDatabase(chatId) {
    return getLastUser(pool, chatId);
}

function searchUserInDatabase(chatId, searchString) {
    return searchUser(pool, chatId, searchString);
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

function checkGameStatusFromDatabase(gameId) {
    return checkGameStatus(pool, gameId);
}

function getJokeFromDataBase(jokeType) {
    return getJoke(pool, jokeType);
}

function addJokeToDataBase(joke, jokeType) {
    return addJoke(pool, joke, jokeType);
}

function deleteJokeFromDataBase(jokeId) {
    return deleteJoke(pool, jokeId);
}

function getJokesFromDataBase(jokeType) {
    return getJokes(pool, jokeType);
}

function updateJokeInDataBase(jokeId, joke, jokeType) {
    return updateJoke(pool, jokeId, joke, jokeType);
}

module.exports = {
    addUserToDatabase,
    getUsersFromDatabase,
    getLastUserFromDatabase,
    searchUserInDatabase,
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
    changeGameLimitFromDataBase,
    checkGameStatusFromDatabase,
    getJokeFromDataBase,
    addJokeToDataBase,
    deleteJokeFromDataBase,
    getJokesFromDataBase,
    updateJokeInDataBase
}