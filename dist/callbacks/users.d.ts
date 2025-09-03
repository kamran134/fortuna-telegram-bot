import { CallbackQuery } from 'node-telegram-bot-api';
export declare function sendMessage(bot: any, chatId: number, message: string): Promise<void>;
export declare function showUsersInSelectedGroup(query: CallbackQuery, bot: any): Promise<void>;
export declare function showLastUserInSelectedGroup(query: CallbackQuery, bot: any): Promise<void>;
export declare function searchUserInSelectedGroup(query: CallbackQuery, bot: any): Promise<void>;
