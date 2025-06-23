import { Pool } from 'pg';
import { addUser, getUsers, getLastUser, searchUser, addGuest_old, getRandomUser, getAzList, editUser, getUserChat, getInactiveUsers, removeUser, getUserByUsername } from './users.js';
import { addGame, getGames, getGamesTimes, deactiveGame, deleteGame, changeGameLimit, checkGameStatus } from './games.js';
import { getGamePlayers, addGamePlayerByLabel, addGamePlayerById, removeGamePlayerById, getUndecidedPlayers } from './gamePlayers.js';
import { adminGroupAdd, getGroups } from './adminGroup.js';
import { getJoke, addJoke, deleteJoke, getJokes, updateJoke } from './jokes.js';
import { User } from '../models/User.js';
import { JokeTypes } from '../common/jokeTypes.js';
import { pool } from './config.js';

interface ChatAndUser {
    chatId: number;
    user: User;
}

interface GameOptions {
    label: string;
    limit: number;
}

interface GuestOptions {
    chatId: number;
    userId: number;
    firstName: string;
    lastName: string;
    username?: string;
}

interface GroupAdminOptions {
    chatId: number;
    adminChatId: number;
    groupName: string;
}

interface GamePlayerOptions {
    gameId: number;
    chatId: number;
    userId: number;
    confirmed_attendance?: boolean;
}

interface UserEditOptions {
    userId: number;
    firstName: string;
    lastName: string;
    fullnameAz: string;
}

export async function addUserToDatabase(chatAndUser: ChatAndUser): Promise<string> {
    return addUser(pool, chatAndUser);
}

export async function getUsersFromDatabase(chatId: number): Promise<User[]> {
    return getUsers(pool, chatId);
}

export async function getUserByUsernameFromDatabase(username: string): Promise<User | null> {
    return getUserByUsername(pool, username);
}

export async function getLastUserFromDatabase(chatId: number): Promise<User | null> {
    return getLastUser(pool, chatId);
}

export async function searchUserInDatabase(chatId: number, searchString: string): Promise<User[]> {
    return searchUser(pool, chatId, searchString);
}

export async function getUserChatFromDatabase(userId: number): Promise<number | null> {
    return getUserChat(pool, userId);
}

export async function addGameToDatabase(chatId: number, gameOptions: GameOptions): Promise<string> {
    return addGame(pool, chatId, gameOptions);
}

export async function getGamesFromDatabase(chatId: number): Promise<any[]> {
    return getGames(pool, chatId);
}

export async function getGamePlayersFromDataBase(chatId: number): Promise<any[]> {
    return getGamePlayers(pool, chatId);
}

export async function getUndecidedPlayersFromDataBase(chatId: number): Promise<any[]> {
    return getUndecidedPlayers(pool, chatId);
}

export async function addGuestToDatabase(guestOptions: GuestOptions): Promise<string> {
    return addGuest_old(pool, guestOptions);
}

export async function addGuestToGame(gameOptions: GamePlayerOptions): Promise<string> {
    return addGamePlayerByLabel(pool, gameOptions);
}

export async function getGamesTimesFromDatabase(chatId: number): Promise<any[]> {
    return getGamesTimes(pool, chatId);
}

export async function getRandomUserFromDatabase(chatId: number): Promise<User | null> {
    return getRandomUser(pool, chatId);
}

export async function getAzListFromDatabase(chatId: number, gameLabel: string): Promise<any[]> {
    return getAzList(pool, chatId, gameLabel);
}

export async function addGroupAdminToDatabase(options: GroupAdminOptions): Promise<string> {
    return adminGroupAdd(pool, options);
}

export async function getGroupsFromDataBase(adminChatId: number): Promise<any[]> {
    return getGroups(pool, adminChatId);
}

export async function addGamePlayerByIdToDatabase(options: GamePlayerOptions): Promise<string> {
    return addGamePlayerById(pool, options);
}

export async function deactiveGameInDatabase(gameId: number): Promise<string> {
    return deactiveGame(pool, gameId);
}

export async function deleteGameFromDatabase(gameId: number): Promise<string> {
    return deleteGame(pool, gameId);
}

export async function editUserInDatabase(options: UserEditOptions): Promise<string> {
    return editUser(pool, options);
}

export async function removeGamePlayerByIdFromDatabase(options: GamePlayerOptions): Promise<string> {
    return removeGamePlayerById(pool, options);
}

export async function getInactiveUsersFromDatabase(chatId: number): Promise<User[]> {
    return getInactiveUsers(pool, chatId);
}

export async function changeGameLimitFromDataBase(chatId: number, options: GameOptions): Promise<string> {
    return changeGameLimit(pool, chatId, options);
}

export async function checkGameStatusFromDatabase(gameId: number): Promise<boolean> {
    return checkGameStatus(pool, gameId);
}

export async function getJokeFromDataBase(jokeType: JokeTypes): Promise<string> {
    return getJoke(pool, jokeType);
}

export async function addJokeToDataBase(joke: string, jokeType: JokeTypes): Promise<string> {
    return addJoke(pool, joke, jokeType);
}

export async function deleteJokeFromDataBase(jokeId: number): Promise<string> {
    return deleteJoke(pool, jokeId);
}

export async function getJokesFromDataBase(jokeType: JokeTypes): Promise<any[]> {
    return getJokes(pool, jokeType);
}

export async function updateJokeInDataBase(jokeId: number, joke: string, jokeType: JokeTypes): Promise<string> {
    return updateJoke(pool, jokeId, joke, jokeType);
}

export async function removeUserFromDatabase(chatId: number, userId: number): Promise<string> {
    return removeUser(pool, chatId, userId);
} 