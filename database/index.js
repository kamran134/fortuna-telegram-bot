// import { Pool } from 'pg';

import pgk from 'pg';
import { addUser, getUsers, getLastUser, searchUser, addGuest, getRandomUser, getAzList, editUser, getUserChat, getInactiveUsers, removeUser } from './users.js';
import { addGame, getGames, getGamesTimes, deactiveGame, deleteGame, changeGameLimit, checkGameStatus } from './games.js';
import { getGamePlayers, addGamePlayerByLabel, addGamePlayerById, removeGamePlayerById, getUndecidedPlayers } from './gamePlayers.js';
import { adminGroupAdd, getGroups } from './adminGroup.js';
import { getJoke, addJoke, deleteJoke, getJokes, updateJoke } from './jokes.js';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pgk;

// Создаем пулл соединений к базе данных
const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: 'db',
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
});

export function addUserToDatabase(chatAndUser) {
    // const { user: { first_name, last_name, id: userId, username }, chatId } = msg;
    return addUser(pool, chatAndUser);
}

export function getUsersFromDatabase(chatId) {
    return getUsers(pool, chatId);
}

export function getLastUserFromDatabase(chatId) {
    return getLastUser(pool, chatId);
}

export function searchUserInDatabase(chatId, searchString) {
    return searchUser(pool, chatId, searchString);
}

export function getUserChatFromDatabase(userId) {
    return getUserChat(pool, userId);
}

export function addGameToDatabase(chatId, gameOptions) {
    return addGame(pool, chatId, gameOptions);
}

export function getGamesFromDatabase(chatId) {
    return getGames(pool, chatId);
}

export function getGamePlayersFromDataBase(chatId) {
    return getGamePlayers(pool, chatId);
}

export function getUndecidedPlayersFromDataBase(chatId) {
    return getUndecidedPlayers(pool, chatId);
}

export function addGuestToDatabase(guestOptions) {
    return addGuest(pool, guestOptions);
}

export function addGuestToGame(gameOptions) {
    return addGamePlayerByLabel(pool, gameOptions)
}

export function getGamesTimesFromDatabase(chatId) {
    return getGamesTimes(pool, chatId);
}

export function getRandomUserFromDatabase(chatId) {
    return getRandomUser(pool, chatId);
}

export function getAzListFromDatabase(chatId, gameLabel) {
    return getAzList(pool, chatId, gameLabel);
}

export function addGroupAdminToDatabase({ chatId, adminChatId, groupName }) {
    return adminGroupAdd(pool, { chatId, adminChatId, groupName });
}

export function getGroupsFromDataBase(adminChatId) {
    return getGroups(pool, adminChatId);
}

export function addGamePlayerByIdToDatabase({ gameId, chatId, userId, confirmed_attendance }) {
    return addGamePlayerById(pool, { gameId, chatId, userId, confirmed_attendance });
}

export function deactiveGameInDatabase(gameId) {
    return deactiveGame(pool, gameId);
}

export function deleteGameFromDatabase(gameId) {
    return deleteGame(pool, gameId);
}

export function editUserInDatabase({ userId, firstName, lastName, fullnameAz }) {
    return editUser(pool, {userId, firstName, lastName, fullnameAz });
}

export function removeGamePlayerByIdFromDatabase({ gameId, chatId, userId }) {
    return removeGamePlayerById(pool, { gameId, chatId, userId });
}

export function getInactiveUsersFromDatabase(chatId) {
    return getInactiveUsers(pool, chatId)
}

export function changeGameLimitFromDataBase(chatId, {label, limit}) {
    return changeGameLimit(pool, chatId, {label, limit});
}

export function checkGameStatusFromDatabase(gameId) {
    return checkGameStatus(pool, gameId);
}

export function getJokeFromDataBase(jokeType) {
    return getJoke(pool, jokeType);
}

export function addJokeToDataBase(joke, jokeType) {
    return addJoke(pool, joke, jokeType);
}

export function deleteJokeFromDataBase(jokeId) {
    return deleteJoke(pool, jokeId);
}

export function getJokesFromDataBase(jokeType) {
    return getJokes(pool, jokeType);
}

export function updateJokeInDataBase(jokeId, joke, jokeType) {
    return updateJoke(pool, jokeId, joke, jokeType);
}

export function removeUserFromDatabase(chatId, userId) {
    return removeUser(pool, chatId, userId);
}