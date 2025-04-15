export async function getJoke(pool, jokeType) {
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

export async function addJoke(pool, joke, jokeType) {
    try {
        const result = await pool.query(`INSERT INTO jokes (joke, type) VALUES ($1, $2);`, [joke, jokeType]);
        return result;
    } catch (error) {
        console.error('ADD JOKE ERROR: ', error);
        throw error;
    }
}

export async function deleteJoke(pool, jokeId) {
    try {
        const result = await pool.query(`DELETE FROM jokes WHERE id = $1;`, [jokeId]);
        return result;
    } catch (error) {
        console.error('DELETE JOKE ERROR: ', error);
        throw error;
    }
}

export async function getJokes(pool, jokeType) {
    try {
        let queryString = `SELECT * FROM jokes`;
        let args = [];

        if (jokeType && jokeType > 0) {
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

export async function updateJoke(pool, jokeId, joke, jokeType) {
    try {
        if (jokeType && jokeType > 0) {
            const result = await pool.query(`UPDATE jokes SET joke = $1, type = $2 WHERE id = $3;`, [joke, jokeType, jokeId]);
            return result;
        } else {
            const result = await pool.query(`UPDATE jokes SET joke = $1 WHERE id = $2;`, [joke, jokeId]);
            return result;
        }
    } catch (error) {
        console.error('UPDATE JOKE ERROR: ', error);
    }
}
