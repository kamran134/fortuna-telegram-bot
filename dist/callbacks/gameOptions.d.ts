import { CallbackQuery } from 'node-telegram-bot-api';
export declare function deactiveGame(query: CallbackQuery, bot: any, isAdmin: boolean): Promise<void>;
export declare function startGameInSelectedGroup(query: CallbackQuery, bot: any): Promise<void>;
export declare function showGamesInSelectedGroup(query: CallbackQuery, bot: any): Promise<void>;
export declare function tagGamePlayersInSelectedGroup(query: CallbackQuery, bot: any): Promise<void>;
export declare function showPayListInSelectedGroup(query: CallbackQuery, bot: any): Promise<void>;
