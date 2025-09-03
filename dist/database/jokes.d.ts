import { Pool } from 'pg';
interface Joke {
    id: number;
    joke: string;
    type: JokeTypes;
}
export declare function getJoke(pool: Pool, jokeType: JokeTypes): Promise<string | undefined>;
export declare function addJoke(pool: Pool, joke: string, jokeType: JokeTypes): Promise<void>;
export declare function deleteJoke(pool: Pool, jokeId: number): Promise<void>;
export declare function getJokes(pool: Pool, jokeType?: JokeTypes): Promise<Joke[] | undefined>;
export declare function updateJoke(pool: Pool, jokeId: number, joke: string, jokeType?: JokeTypes): Promise<void>;
export {};
