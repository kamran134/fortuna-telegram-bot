import { Pool } from 'pg';
import { JokeTypesValues } from '../common/jokeTypes';
interface Joke {
    id: number;
    joke: string;
    type: JokeTypesValues;
}
export declare function getJoke(pool: Pool, jokeType: JokeTypesValues): Promise<string | undefined>;
export declare function addJoke(pool: Pool, joke: string, jokeType: JokeTypesValues): Promise<void>;
export declare function deleteJoke(pool: Pool, jokeId: number): Promise<void>;
export declare function getJokes(pool: Pool, jokeType?: JokeTypesValues): Promise<Joke[] | undefined>;
export declare function updateJoke(pool: Pool, jokeId: number, joke: string, jokeType?: JokeTypesValues): Promise<void>;
export {};
//# sourceMappingURL=jokes.d.ts.map