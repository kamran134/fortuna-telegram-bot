CREATE DATABASE fortuna;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE fortuna TO postgres;

\connect fortuna

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    user_id BIGINT NOT NULL,
    chat_id BIGINT NOT NULL,
    username TEXT,
    UNIQUE(user_id, chat_id)
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    game_date DATE,
    game_starts TIME,
    game_ends TIME,
    place TEXT,
    quote INT,
    chat_id BIGINT NOT NULL,
    status BOOLEAN
);

CREATE TABLE game_users (
    user_id BIGINT REFERENCES users(id),
    game_id BIGINT REFERENCES games(id),
    participate_time TIMESTAMP,
    exactly BOOLEAN,
    PRIMARY KEY(user_id, game_id)
);