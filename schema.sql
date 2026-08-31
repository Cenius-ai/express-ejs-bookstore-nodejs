-- Books table
CREATE TABLE IF NOT EXISTS books (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    author      TEXT    NOT NULL,
    description TEXT,
    price       REAL    NOT NULL  CHECK (price >= 0),
    cover_url   TEXT,
    stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL
);
