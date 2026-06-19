
const { pool } = require('../config/db');

const User = {
  async create(name, email, passwordHash) {
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [name, email, passwordHash]
    );
    return result.rows[0];
  },
  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },
  async findByName(name) {
    const result = await pool.query('SELECT * FROM users WHERE name = $1', [name]);
    return result.rows[0];
  },
  async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }
};

module.exports = User;
