import { addUser, getUsers, getLastUser, searchUser, addGuest_old, getRandomUser, getAzList, editUser, getUserChat, getInactiveUsers, removeUser, getUserByUsername } from './users.js';
import { addGame, getGames, getGamesTimes, deactiveGame, deleteGame, changeGameLimit, checkGameStatus } from './games.js';
import { getGamePlayers, addGamePlayerByLabel, addGamePlayerById, removeGamePlayerById, getUndecidedPlayers } from './gamePlayers.js';
import { adminGroupAdd, getGroups } from './adminGroup.js';
import { getJoke, addJoke, deleteJoke, getJokes, updateJoke } from './jokes.js';
import { pool } from './config.js';
export async function addUserToDatabase(chatAndUser) {
    return addUser(pool, chatAndUser);
}
export async function getUsersFromDatabase(chatId) {
    return getUsers(pool, chatId);
}
export async function getUserByUsernameFromDatabase(username) {
    return getUserByUsername(pool, username);
}
export async function getLastUserFromDatabase(chatId) {
    return getLastUser(pool, chatId);
}
export async function searchUserInDatabase(chatId, searchString) {
    return searchUser(pool, chatId, searchString);
}
export async function getUserChatFromDatabase(userId) {
    return getUserChat(pool, userId);
}
export async function addGameToDatabase(chatId, gameOptions) {
    return addGame(pool, chatId, gameOptions);
}
export async function getGamesFromDatabase(chatId) {
    return getGames(pool, chatId);
}
export async function getGamePlayersFromDataBase(chatId) {
    return getGamePlayers(pool, chatId);
}
export async function getUndecidedPlayersFromDataBase(chatId) {
    return getUndecidedPlayers(pool, chatId);
}
export async function addGuestToDatabase(guestOptions) {
    return addGuest_old(pool, guestOptions);
}
export async function addGuestToGame(gameOptions) {
    return addGamePlayerByLabel(pool, gameOptions);
}
export async function getGamesTimesFromDatabase(chatId) {
    return getGamesTimes(pool, chatId);
}
export async function getRandomUserFromDatabase(chatId) {
    return getRandomUser(pool, chatId);
}
export async function getAzListFromDatabase(chatId, gameLabel) {
    return getAzList(pool, chatId, gameLabel);
}
export async function addGroupAdminToDatabase(options) {
    return adminGroupAdd(pool, options);
}
export async function getGroupsFromDataBase(adminChatId) {
    return getGroups(pool, adminChatId);
}
export async function addGamePlayerByIdToDatabase(options) {
    return addGamePlayerById(pool, options);
}
export async function deactiveGameInDatabase(gameId) {
    return deactiveGame(pool, gameId);
}
export async function deleteGameFromDatabase(gameId) {
    return deleteGame(pool, gameId);
}
export async function editUserInDatabase(options) {
    return editUser(pool, options);
}
export async function removeGamePlayerByIdFromDatabase(options) {
    return removeGamePlayerById(pool, options);
}
export async function getInactiveUsersFromDatabase(chatId) {
    return getInactiveUsers(pool, chatId);
}
export async function changeGameLimitFromDataBase(chatId, options) {
    return changeGameLimit(pool, chatId, options);
}
export async function checkGameStatusFromDatabase(gameId) {
    return checkGameStatus(pool, gameId);
}
export async function getJokeFromDataBase(jokeType) {
    return getJoke(pool, jokeType);
}
export async function addJokeToDataBase(joke, jokeType) {
    return addJoke(pool, joke, jokeType);
}
export async function deleteJokeFromDataBase(jokeId) {
    return deleteJoke(pool, jokeId);
}
export async function getJokesFromDataBase(jokeType) {
    return getJokes(pool, jokeType);
}
export async function updateJokeInDataBase(jokeId, joke, jokeType) {
    return updateJoke(pool, jokeId, joke, jokeType);
}
export async function removeUserFromDatabase(chatId, userId) {
    return removeUser(pool, chatId, userId);
}
//# sourceMappingURL=index.js.map