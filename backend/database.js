

const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./database.db")

// Tabelle erstellen (falls sie nicht existiert)
db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    userid INTEGER,
    text TEXT,
    image TEXT,
    liked INTEGER
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`)

module.exports = db