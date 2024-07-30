async function getJoke(pool, jokeType) {
    try {
        const result = await pool.query(`SELECT * FROM jokes WHERE type = $1 ORDER BY RANDOM() LIMIT 1;`, [jokeType]);

        if (result && result.rows) {
            return result.rows[0].joke;
        } else {
            console.error('Get joke error');
            return undefined;
        }
    } catch(error) {
        console.error('GET JOKE: ', error);
        throw error;
    }
}

module.exports = {
    getJoke
}