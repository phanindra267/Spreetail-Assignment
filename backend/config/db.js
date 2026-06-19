
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'spreetail_expenses',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(100) UNIQUE,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS group_memberships (
        id SERIAL PRIMARY KEY,
        group_id INT NOT NULL REFERENCES groups(id),
        user_id INT NOT NULL REFERENCES users(id),
        joined_at DATE NOT NULL,
        left_at DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        group_id INT NOT NULL REFERENCES groups(id),
        payer_id INT NOT NULL REFERENCES users(id),
        amount NUMERIC(10,2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'INR',
        description TEXT,
        date DATE NOT NULL,
        split_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS expense_splits (
        id SERIAL PRIMARY KEY,
        expense_id INT NOT NULL REFERENCES expenses(id),
        user_id INT NOT NULL REFERENCES users(id),
        amount NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS settlements (
        id SERIAL PRIMARY KEY,
        group_id INT NOT NULL REFERENCES groups(id),
        payer_id INT NOT NULL REFERENCES users(id),
        payee_id INT NOT NULL REFERENCES users(id),
        amount NUMERIC(10,2) NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS import_reports (
        id SERIAL PRIMARY KEY,
        group_id INT REFERENCES groups(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS import_anomalies (
        id SERIAL PRIMARY KEY,
        import_report_id INT NOT NULL REFERENCES import_reports(id),
        row_number INT,
        issue_type VARCHAR(100),
        description TEXT,
        action_taken VARCHAR(100),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    pool.end();
  }
};

module.exports = {
  pool,
  migrate: createTables,
};
