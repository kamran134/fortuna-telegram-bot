import { User } from '../models/User.js';
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
export declare function addUserToDatabase(chatAndUser: ChatAndUser): Promise<string>;
export declare function getUsersFromDatabase(chatId: number): Promise<User[]>;
export declare function getUserByUsernameFromDatabase(username: string): Promise<User | null>;
export declare function getLastUserFromDatabase(chatId: number): Promise<User | null>;
export declare function searchUserInDatabase(chatId: number, searchString: string): Promise<User[]>;
export declare function getUserChatFromDatabase(userId: number): Promise<number | null>;
export declare function addGameToDatabase(chatId: number, gameOptions: GameOptions): Promise<string>;
export declare function getGamesFromDatabase(chatId: number): Promise<any[]>;
export declare function getGamePlayersFromDataBase(chatId: number): Promise<any[]>;
export declare function getUndecidedPlayersFromDataBase(chatId: number): Promise<any[]>;
export declare function addGuestToDatabase(guestOptions: GuestOptions): Promise<string>;
export declare function addGuestToGame(gameOptions: GamePlayerOptions): Promise<string>;
export declare function getGamesTimesFromDatabase(chatId: number): Promise<any[]>;
export declare function getRandomUserFromDatabase(chatId: number): Promise<User | null>;
export declare function getAzListFromDatabase(chatId: number, gameLabel: string): Promise<any[]>;
export declare function addGroupAdminToDatabase(options: GroupAdminOptions): Promise<string>;
export declare function getGroupsFromDataBase(adminChatId: number): Promise<any[]>;
export declare function addGamePlayerByIdToDatabase(options: GamePlayerOptions): Promise<string>;
export declare function deactiveGameInDatabase(gameId: number): Promise<string>;
export declare function deleteGameFromDatabase(gameId: number): Promise<string>;
export declare function editUserInDatabase(options: UserEditOptions): Promise<string>;
export declare function removeGamePlayerByIdFromDatabase(options: GamePlayerOptions): Promise<string>;
export declare function getInactiveUsersFromDatabase(chatId: number): Promise<User[]>;
export declare function changeGameLimitFromDataBase(chatId: number, options: GameOptions): Promise<string>;
export declare function checkGameStatusFromDatabase(gameId: number): Promise<boolean>;
export declare function getJokeFromDataBase(jokeType: JokeTypes): Promise<string>;
export declare function addJokeToDataBase(joke: string, jokeType: JokeTypes): Promise<string>;
export declare function deleteJokeFromDataBase(jokeId: number): Promise<string>;
export declare function getJokesFromDataBase(jokeType: JokeTypes): Promise<any[]>;
export declare function updateJokeInDataBase(jokeId: number, joke: string, jokeType: JokeTypes): Promise<string>;
export declare function removeUserFromDatabase(chatId: number, userId: number): Promise<string>;
export {};
