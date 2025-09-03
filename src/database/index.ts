import { Pool } from 'pg';
import { addUser, getUsers, getLastUser, searchUser, addGuest_old, getRandomUser, getAzList, editUser, getUserChat, getInactiveUsers, removeUser, getUserByUsername } from './users';
import { addGame, getGames, getGamesTimes, deactiveGame, deleteGame, changeGameLimit, checkGameStatus } from './games';
import { getGamePlayers, addGamePlayerByLabel, addGamePlayerById, removeGamePlayerById, getUndecidedPlayers, GamePlayerRemovalOptions } from './gamePlayers';
import { adminGroupAdd, getGroups } from './adminGroup';
import { getJoke, addJoke, deleteJoke, getJokes, updateJoke } from './jokes';
import { User } from '../models/User';
import { JokeTypes, JokeTypesValues } from '../common/jokeTypes';
import { pool } from './config';

interface ChatAndUser {
    chatId: number;
    user: User;
}

interface GameOptions {
    date: string;
    start: string;
    end: string;
    users_limit: number;
    location: string;
    label: string;
}

interface GuestOptions {
    chatId: number;
    first_name: string;
    last_name: string;
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
    confirmed_attendance: boolean;
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
    const result = await addGame(pool, chatId, gameOptions);
    return result ? `Game created with ID: ${result}` : 'Failed to create game';
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
    const result = await addGuest_old(pool, guestOptions);
    return result ? `Guest added with ID: ${result}` : 'Failed to add guest';
}

export async function addGuestToGame(gameOptions: GamePlayerOptions): Promise<string> {
    addGamePlayerByLabel(pool, gameOptions);
    return 'Guest added successfully';
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
    adminGroupAdd(pool, options);
    return 'Group admin added successfully';
}

export async function getGroupsFromDataBase(adminChatId: number): Promise<any[]> {
    return getGroups(pool, adminChatId);
}

export async function addGamePlayerByIdToDatabase(options: GamePlayerOptions): Promise<string> {
    const result = await addGamePlayerById(pool, options);
    return result || '';
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

export async function removeGamePlayerByIdFromDatabase(options: GamePlayerRemovalOptions): Promise<string> {
    const result = await removeGamePlayerById(pool, options);
    return result || '';
}

export async function getInactiveUsersFromDatabase(chatId: number): Promise<User[]> {
    return getInactiveUsers(pool, chatId);
}

interface GameLimitOptions {
    label: string;
    limit: number;
}

export async function changeGameLimitFromDataBase(chatId: number, options: GameLimitOptions): Promise<string> {
    return changeGameLimit(pool, chatId, options);
}

export async function checkGameStatusFromDatabase(gameId: number): Promise<boolean> {
    return checkGameStatus(pool, gameId);
}

export async function getJokeFromDataBase(jokeType: JokeTypesValues): Promise<string> {
    const result = await getJoke(pool, jokeType);
    return result || '';
}

export async function addJokeToDataBase(joke: string, jokeType: JokeTypesValues): Promise<string> {
    await addJoke(pool, joke, jokeType);
    return 'Joke added successfully';
}

export async function deleteJokeFromDataBase(jokeId: number): Promise<string> {
    await deleteJoke(pool, jokeId);
    return 'Joke deleted successfully';
}

export async function getJokesFromDataBase(jokeType: JokeTypesValues): Promise<any[]> {
    const result = await getJokes(pool, jokeType);
    return result || [];
}

export async function updateJokeInDataBase(jokeId: number, joke: string, jokeType: JokeTypesValues): Promise<string> {
    await updateJoke(pool, jokeId, joke, jokeType);
    return 'Joke updated successfully';
}

export async function removeUserFromDatabase(chatId: number, userId: number): Promise<string> {
    return removeUser(pool, chatId, userId);
} 