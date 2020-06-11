const sqlite = require('sqlite3');

const db = new sqlite.Database('./db/car-rental-db.db', (err) => {
    if (err) throw err;
});

module.exports = db;