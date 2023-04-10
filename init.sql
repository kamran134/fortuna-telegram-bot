CREATE DATABASE fortuna;
CREATE USER postgres WITH PASSWORD 'kamran134';
GRANT ALL PRIVILEGES ON DATABASE fortuna TO postgres;

\connect fortuna

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fullname TEXT NOT NULL,
  chat_id BIGINT UNIQUE NOT NULL
);
