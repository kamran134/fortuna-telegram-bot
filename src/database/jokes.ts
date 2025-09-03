import { Pool } from 'pg';
import { JokeTypes, JokeTypesValues } from '../common/jokeTypes';

interface Joke {
    id: number;
    joke: string;
    type: JokeTypesValues;
}

export async function getJoke(pool: Pool, jokeType: JokeTypesValues): Promise<string | undefined> {
    try {
        const result = await pool.query(`SELECT * FROM jokes WHERE type = $1 ORDER BY RANDOM() LIMIT 1;`, [jokeType]);

        if (result && result.rows) {
            return result.rows[0].joke;
        } else {
            console.error('Get joke error');
            return undefined;
        }
    } catch (error) {
        console.error('GET JOKE ERROR: ', error);
        throw error;
    }
}

export async function addJoke(pool: Pool, joke: string, jokeType: JokeTypesValues): Promise<void> {
    try {
        await pool.query(`INSERT INTO jokes (joke, type) VALUES ($1, $2);`, [joke, jokeType]);
    } catch (error) {
        console.error('ADD JOKE ERROR: ', error);
        throw error;
    }
}

export async function deleteJoke(pool: Pool, jokeId: number): Promise<void> {
    try {
        await pool.query(`DELETE FROM jokes WHERE id = $1;`, [jokeId]);
    } catch (error) {
        console.error('DELETE JOKE ERROR: ', error);
        throw error;
    }
}

export async function getJokes(pool: Pool, jokeType?: JokeTypesValues): Promise<Joke[] | undefined> {
    try {
        let queryString = `SELECT * FROM jokes`;
        let args: (string | number)[] = [];

        if (jokeType) {
            queryString += ` WHERE type = $1 ORDER BY id ASC;`
            args.push(jokeType);
        }
        else queryString += ` ORDER BY id ASC;`;

        const result = await pool.query(queryString, args);
        if (result && result.rows) {
            return result.rows;
        } else {
            console.error('Get jokes error');
            return undefined;
        }
    } catch (error) {
        console.error('GET JOKES ERROR: ', error);
        throw error;
    }
}

export async function updateJoke(pool: Pool, jokeId: number, joke: string, jokeType?: JokeTypesValues): Promise<void> {
    try {
        if (jokeType) {
            await pool.query(`UPDATE jokes SET joke = $1, type = $2 WHERE id = $3;`, [joke, jokeType, jokeId]);
        } else {
            await pool.query(`UPDATE jokes SET joke = $1 WHERE id = $2;`, [joke, jokeId]);
        }
    } catch (error) {
        console.error('UPDATE JOKE ERROR: ', error);
        throw error;
    }
} 