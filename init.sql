CREATE DATABASE fortuna;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE fortuna TO postgres;

\connect fortuna

CREATE TABLE users IF NOT EXISTS (
    id SERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    username TEXT,
    PRIMARY KEY(id)
);

CREATE TABLE group_users IF NOT EXISTS (
    user_id BIGINT REFERENCES users(id),
    chat_id BIGINT NOT NULL,
    chat_role TEXT,
    PRIMARY KEY(user_id, chat_id)
);

CREATE TABLE games IF NOT EXISTS (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    game_date DATE,
    game_starts TIME,
    game_ends TIME,
    place TEXT,
    participate_limit INT,
    status BOOLEAN,
    label TEXT
);

CREATE TABLE game_users IF NOT EXISTS (
    user_id BIGINT REFERENCES users(id),
    game_id BIGINT REFERENCES games(id),
    participate_time TIMESTAMP,
    exactly BOOLEAN,
    PRIMARY KEY(user_id, game_id)
);

CREATE TABLE game_guest IF NOT EXISTS (
    game_id BIGINT REFERENCES games(id),
    fullname TEXT
);