CREATE DATABASE fortuna;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE fortuna TO postgres;

\connect fortuna

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    user_id BIGINT UNIQUE NOT NULL,
    chat_id BIGINT NOT NULL,
    username TEXT
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    game_date DATE,
    game_starts TIME,
    game_ends TIME,
    place TEXT,
    quote INT
);

CREATE TABLE game_users (
    user_id INTEGER REFERENCES users(id),
    game_id INTEGER REFERENCES games(id),
    participate_time TIMESTAMP,
    exactly BOOLEAN,
    PRIMARY KEY(user_id, game_id)
);