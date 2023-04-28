CREATE DATABASE fortuna;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE fortuna TO postgres;

\connect fortuna

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    username TEXT,
    is_guest BOOLEAN,
    guest_name TEXT,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS group_users (
    user_id BIGINT REFERENCES users(id),
    chat_id BIGINT NOT NULL,
    chat_role TEXT,
    PRIMARY KEY(user_id, chat_id)
);

CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    game_date DATE,
    game_starts TIME,
    game_ends TIME,
    place TEXT,
    participate_limit INT,
    is_active BOOLEAN,
    label TEXT,
    UNIQUE(chat_id, game_date, label)
);

CREATE TABLE IF NOT EXISTS game_users (
    user_id BIGINT REFERENCES users(id),
    game_id BIGINT REFERENCES games(id),
    participate_time TIMESTAMP,
    exactly BOOLEAN,
    PRIMARY KEY(user_id, game_id)
);

CREATE TABLE IF NOT EXISTS game_guests (
    game_id BIGINT REFERENCES games(id),
    fullname TEXT,
    participate_time TIMESTAMP,
    exactly BOOLEAN
);

CREATE TABLE IF NOT EXISTS admin_groups (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT UNIQUE NOT NULL,
    admin_chat_id BIGINT,
    group_name TEXT,
    UNIQUE(chat_id, admin_chat_id)
);