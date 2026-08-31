const bcrypt = require("bcryptjs");
const { getDb } = require("../db");

/**
 * Find an admin by username. Returns { id, username, password_hash } or undefined.
 */
function findByUsername(username) {
  return getDb()
    .prepare("SELECT id, username, password_hash FROM admins WHERE username = ?")
    .get(username);
}

/**
 * Verify a plaintext password against a stored bcrypt hash.
 */
function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

/**
 * Create a new admin with a bcrypt-hashed password.
 * Returns the new admin's id. Throws on duplicate username.
 */
function create(username, plainPassword) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(plainPassword, salt);

  const result = getDb()
    .prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)")
    .run(username, hash);

  return result.lastInsertRowid;
}

module.exports = { findByUsername, verifyPassword, create };
