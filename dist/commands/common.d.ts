import { Message } from 'node-telegram-bot-api';
import { User } from '../models/User.js';
export declare function tagUsers(users: User[]): string;
export declare function listUsers(users: User[]): string;
export declare function tagUsersByCommas(users: User[]): string;
export declare function showMenu(msg: Message, bot: any): void;
