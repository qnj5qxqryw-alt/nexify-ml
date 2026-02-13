import Database from "better-sqlite3";

// Create / open database file
const db = new Database('nexify.db');

// Create users table
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      referral_code TEXT UNIQUE,
      plan TEXT DEFAULT 'free',
      plan_expires_at TEXT,
      last_reward_date TEXT
    )
`).run();

// Create weather table
db.prepare(`
    CREATE TABLE IF NOT EXISTS weather (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      city TEXT,
      temperature REAl,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`).run(); 

// Score Table (SkyScore)
db.prepare(`
  CREATE TABLE IF NOT EXISTS scores (
    user_id INTEGER PRIMARY KEY,
    score INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  ) 
`).run();

// Referrals Table
db.prepare(`
  CREATE TABLE IF NOT EXISTS referrals (
    referrer_id INTEGER,
    referred_id INTEGER UNIQUE,
    FOREIGN KEY (referrer_id) REFERENCES users(id),
    FOREIGN KEY (referred_id) REFERENCES users(id)
    )
`).run();

export default db;



 
