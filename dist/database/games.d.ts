import { Pool } from 'pg';
import { Game } from '../models/Game';
interface GameOptions {
    date: string;
    start: string;
    end: string;
    users_limit: number;
    location: string;
    label: string;
}
interface GameLimitOptions {
    label: string;
    limit: number;
}
export declare function getGames(pool: Pool, chatId: number): Promise<Game[]>;
export declare function getGamesTimes(pool: Pool, chatId: number): Promise<{
    game_starts: string;
    label: string;
}[]>;
export declare function addGame(pool: Pool, chatId: number, { date, start, end, users_limit, location, label }: GameOptions): Promise<number | undefined>;
export declare function deactiveGame(pool: Pool, gameId: number): Promise<string>;
export declare function deleteGame(pool: Pool, gameId: number): Promise<string>;
export declare function changeGameLimit(pool: Pool, chatId: number, { label, limit }: GameLimitOptions): Promise<string>;
export declare function checkGameStatus(pool: Pool, gameId: number): Promise<boolean>;
export {};
//# sourceMappingURL=games.d.ts.map