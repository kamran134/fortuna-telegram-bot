"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToDatabase = addUserToDatabase;
exports.getUsersFromDatabase = getUsersFromDatabase;
exports.getUserByUsernameFromDatabase = getUserByUsernameFromDatabase;
exports.getLastUserFromDatabase = getLastUserFromDatabase;
exports.searchUserInDatabase = searchUserInDatabase;
exports.getUserChatFromDatabase = getUserChatFromDatabase;
exports.addGameToDatabase = addGameToDatabase;
exports.getGamesFromDatabase = getGamesFromDatabase;
exports.getGamePlayersFromDataBase = getGamePlayersFromDataBase;
exports.getUndecidedPlayersFromDataBase = getUndecidedPlayersFromDataBase;
exports.addGuestToDatabase = addGuestToDatabase;
exports.addGuestToGame = addGuestToGame;
exports.getGamesTimesFromDatabase = getGamesTimesFromDatabase;
exports.getRandomUserFromDatabase = getRandomUserFromDatabase;
exports.getAzListFromDatabase = getAzListFromDatabase;
exports.addGroupAdminToDatabase = addGroupAdminToDatabase;
exports.getGroupsFromDataBase = getGroupsFromDataBase;
exports.addGamePlayerByIdToDatabase = addGamePlayerByIdToDatabase;
exports.deactiveGameInDatabase = deactiveGameInDatabase;
exports.deleteGameFromDatabase = deleteGameFromDatabase;
exports.editUserInDatabase = editUserInDatabase;
exports.removeGamePlayerByIdFromDatabase = removeGamePlayerByIdFromDatabase;
exports.getInactiveUsersFromDatabase = getInactiveUsersFromDatabase;
exports.changeGameLimitFromDataBase = changeGameLimitFromDataBase;
exports.checkGameStatusFromDatabase = checkGameStatusFromDatabase;
exports.getJokeFromDataBase = getJokeFromDataBase;
exports.addJokeToDataBase = addJokeToDataBase;
exports.deleteJokeFromDataBase = deleteJokeFromDataBase;
exports.getJokesFromDataBase = getJokesFromDataBase;
exports.updateJokeInDataBase = updateJokeInDataBase;
exports.removeUserFromDatabase = removeUserFromDatabase;
const users_1 = require("./users");
const games_1 = require("./games");
const gamePlayers_1 = require("./gamePlayers");
const adminGroup_1 = require("./adminGroup");
const jokes_1 = require("./jokes");
const config_1 = require("./config");
async function addUserToDatabase(chatAndUser) {
    return (0, users_1.addUser)(config_1.pool, chatAndUser);
}
async function getUsersFromDatabase(chatId) {
    return (0, users_1.getUsers)(config_1.pool, chatId);
}
async function getUserByUsernameFromDatabase(username) {
    return (0, users_1.getUserByUsername)(config_1.pool, username);
}
async function getLastUserFromDatabase(chatId) {
    return (0, users_1.getLastUser)(config_1.pool, chatId);
}
async function searchUserInDatabase(chatId, searchString) {
    return (0, users_1.searchUser)(config_1.pool, chatId, searchString);
}
async function getUserChatFromDatabase(userId) {
    return (0, users_1.getUserChat)(config_1.pool, userId);
}
async function addGameToDatabase(chatId, gameOptions) {
    const result = await (0, games_1.addGame)(config_1.pool, chatId, gameOptions);
    return result ? `Game created with ID: ${result}` : 'Failed to create game';
}
async function getGamesFromDatabase(chatId) {
    return (0, games_1.getGames)(config_1.pool, chatId);
}
async function getGamePlayersFromDataBase(chatId) {
    return (0, gamePlayers_1.getGamePlayers)(config_1.pool, chatId);
}
async function getUndecidedPlayersFromDataBase(chatId) {
    return (0, gamePlayers_1.getUndecidedPlayers)(config_1.pool, chatId);
}
async function addGuestToDatabase(guestOptions) {
    const result = await (0, users_1.addGuest_old)(config_1.pool, guestOptions);
    return result ? `Guest added with ID: ${result}` : 'Failed to add guest';
}
async function addGuestToGame(gameOptions) {
    (0, gamePlayers_1.addGamePlayerByLabel)(config_1.pool, gameOptions);
    return 'Guest added successfully';
}
async function getGamesTimesFromDatabase(chatId) {
    return (0, games_1.getGamesTimes)(config_1.pool, chatId);
}
async function getRandomUserFromDatabase(chatId) {
    return (0, users_1.getRandomUser)(config_1.pool, chatId);
}
async function getAzListFromDatabase(chatId, gameLabel) {
    return (0, users_1.getAzList)(config_1.pool, chatId, gameLabel);
}
async function addGroupAdminToDatabase(options) {
    (0, adminGroup_1.adminGroupAdd)(config_1.pool, options);
    return 'Group admin added successfully';
}
async function getGroupsFromDataBase(adminChatId) {
    return (0, adminGroup_1.getGroups)(config_1.pool, adminChatId);
}
async function addGamePlayerByIdToDatabase(options) {
    const result = await (0, gamePlayers_1.addGamePlayerById)(config_1.pool, options);
    return result || '';
}
async function deactiveGameInDatabase(gameId) {
    return (0, games_1.deactiveGame)(config_1.pool, gameId);
}
async function deleteGameFromDatabase(gameId) {
    return (0, games_1.deleteGame)(config_1.pool, gameId);
}
async function editUserInDatabase(options) {
    return (0, users_1.editUser)(config_1.pool, options);
}
async function removeGamePlayerByIdFromDatabase(options) {
    const result = await (0, gamePlayers_1.removeGamePlayerById)(config_1.pool, options);
    return result || '';
}
async function getInactiveUsersFromDatabase(chatId) {
    return (0, users_1.getInactiveUsers)(config_1.pool, chatId);
}
async function changeGameLimitFromDataBase(chatId, options) {
    return (0, games_1.changeGameLimit)(config_1.pool, chatId, options);
}
async function checkGameStatusFromDatabase(gameId) {
    return (0, games_1.checkGameStatus)(config_1.pool, gameId);
}
async function getJokeFromDataBase(jokeType) {
    const result = await (0, jokes_1.getJoke)(config_1.pool, jokeType);
    return result || '';
}
async function addJokeToDataBase(joke, jokeType) {
    await (0, jokes_1.addJoke)(config_1.pool, joke, jokeType);
    return 'Joke added successfully';
}
async function deleteJokeFromDataBase(jokeId) {
    await (0, jokes_1.deleteJoke)(config_1.pool, jokeId);
    return 'Joke deleted successfully';
}
async function getJokesFromDataBase(jokeType) {
    const result = await (0, jokes_1.getJokes)(config_1.pool, jokeType);
    return result || [];
}
async function updateJokeInDataBase(jokeId, joke, jokeType) {
    await (0, jokes_1.updateJoke)(config_1.pool, jokeId, joke, jokeType);
    return 'Joke updated successfully';
}
async function removeUserFromDatabase(chatId, userId) {
    return (0, users_1.removeUser)(config_1.pool, chatId, userId);
}
//# sourceMappingURL=index.js.map