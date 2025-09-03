import { GamePlayerRemovalOptions } from './gamePlayers';
import { User } from '../models/User';
import { JokeTypesValues } from '../common/jokeTypes';
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
export declare function removeGamePlayerByIdFromDatabase(options: GamePlayerRemovalOptions): Promise<string>;
export declare function getInactiveUsersFromDatabase(chatId: number): Promise<User[]>;
interface GameLimitOptions {
    label: string;
    limit: number;
}
export declare function changeGameLimitFromDataBase(chatId: number, options: GameLimitOptions): Promise<string>;
export declare function checkGameStatusFromDatabase(gameId: number): Promise<boolean>;
export declare function getJokeFromDataBase(jokeType: JokeTypesValues): Promise<string>;
export declare function addJokeToDataBase(joke: string, jokeType: JokeTypesValues): Promise<string>;
export declare function deleteJokeFromDataBase(jokeId: number): Promise<string>;
export declare function getJokesFromDataBase(jokeType: JokeTypesValues): Promise<any[]>;
export declare function updateJokeInDataBase(jokeId: number, joke: string, jokeType: JokeTypesValues): Promise<string>;
export declare function removeUserFromDatabase(chatId: number, userId: number): Promise<string>;
export {};
//# sourceMappingURL=index.d.ts.map