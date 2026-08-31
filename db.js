const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "bookstore.db");

let db;

function getDb() {
  if (db) return db;

  const exists = fs.existsSync(DB_PATH);
  db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent-read performance
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Create tables if this is a fresh database
  if (!exists) {
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
    db.exec(schema);
  }

  return db;
}

module.exports = { getDb };
