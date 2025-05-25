const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const db = new sqlite3.Database('users.db', (err) => {
    if (err) return console.error(err.message);
    console.log('Csatlakozva az SQLite adatbázishoz.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vezeteknev TEXT,
  keresztnev TEXT,
  email TEXT,
  telefonszam TEXT
)`);


app.post('/users', (req, res) => {
    const { vezeteknev, keresztnev, email, telefonszam } = req.body;
    const stmt = db.prepare('INSERT INTO users (vezeteknev, keresztnev, email, telefonszam) VALUES (?, ?, ?, ?)');
    stmt.run(vezeteknev, keresztnev, email, telefonszam, (err) => {
        if (err) {
            console.error(err.message);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
    stmt.finalize();
});


app.listen(port, () => {
    console.log(`Szerver fut: http://localhost:${port}`);
});
