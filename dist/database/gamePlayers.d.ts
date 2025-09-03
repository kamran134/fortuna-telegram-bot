import { Pool } from 'pg';
interface GamePlayer {
    last_name: string;
    first_name: string;
    username: string;
    user_id: number;
    is_guest: boolean;
    label: string;
    game_date: string;
    game_starts: string;
    game_ends: string;
    place: string;
    game_id: number;
    confirmed_attendance: boolean;
    users_limit: number;
    payed: boolean;
}
interface UndecidedPlayer {
    last_name: string;
    first_name: string;
    username: string;
    user_id: number;
    game_date: string;
    game_id: number;
    confirmed_attendance: boolean;
    users_limit: number;
}
interface GamePlayerOptions {
    gameLabel?: string;
    gameId?: number;
    chatId: number;
    userId: number;
    confirmed_attendance: boolean;
}
export declare function getGamePlayers(pool: Pool, chatId: number): Promise<GamePlayer[]>;
export declare function getUndecidedPlayers(pool: Pool, chatId: number): Promise<UndecidedPlayer[]>;
export declare function addGamePlayerByLabel(pool: Pool, { gameLabel, chatId, userId, confirmed_attendance }: GamePlayerOptions): Promise<void>;
export declare function addGamePlayerById(pool: Pool, { gameId, chatId, userId, confirmed_attendance }: GamePlayerOptions): Promise<string | undefined>;
export declare function removeGamePlayerById(pool: Pool, { gameId, chatId, userId }: GamePlayerOptions): Promise<string | undefined>;
export {};
