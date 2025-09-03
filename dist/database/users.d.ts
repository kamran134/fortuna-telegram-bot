import { Pool } from 'pg';
import { User } from '../models/User.js';
interface ChatAndUser {
    user: User;
    chatId: number;
}
interface GuestOptions {
    chatId: number;
    first_name: string;
    last_name: string;
}
interface GameGuestOptions {
    game_id: number;
    first_name: string;
    last_name: string;
}
interface UserEditOptions {
    userId: number;
    firstName?: string;
    lastName?: string;
    fullnameAz?: string;
}
export declare function addUser(pool: Pool, { user: { first_name, last_name, id: userId, username }, chatId }: ChatAndUser): Promise<string>;
export declare function getUsers(pool: Pool, chatId: number): Promise<User[]>;
export declare function getLastUser(pool: Pool, chatId: number): Promise<User | null>;
export declare function getUserByUsername(pool: Pool, username: string): Promise<User | null>;
export declare function searchUser(pool: Pool, chatId: number, searchString: string): Promise<User[]>;
export declare function getAllUsers(pool: Pool, chatId: number): Promise<User[]>;
export declare function getUserChat(pool: Pool, userId: number): Promise<number | null>;
export declare function addGuest_old(pool: Pool, { chatId, first_name, last_name }: GuestOptions): Promise<number | null>;
export declare function addGuest(pool: Pool, { game_id, first_name, last_name }: GameGuestOptions): Promise<number | null>;
export declare function getRandomUser(pool: Pool, chatId: number): Promise<User | null>;
export declare function getInactiveUsers(pool: Pool, chatId: number): Promise<User[]>;
export declare function getAzList(pool: Pool, chatId: number, gameLabel: string): Promise<any[]>;
export declare function editUser(pool: Pool, { userId, firstName, lastName, fullnameAz }: UserEditOptions): Promise<string>;
export declare function removeUser(pool: Pool, chatId: number, userId: number): Promise<string>;
export {};
