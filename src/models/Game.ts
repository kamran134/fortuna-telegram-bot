export interface Game {
    id: number;
    game_date: string;
    game_starts: string;
    game_ends: string;
    users_limit: number;
    place: string;
    chat_id: number;
    status: boolean;
    label: string;
}

export interface GamePlayer {
    id: number;
    game_id: number;
    user_id: number;
    status: 'active' | 'inactive' | 'undecided';
    created_at: Date;
    updated_at: Date;
}

export interface Group {
    id: number;
    name: string;
    telegram_id: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
} 