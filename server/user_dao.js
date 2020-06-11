const db = require("./db");
const bcrypt = require('bcrypt');
const User = require('./user');

exports.getNameById = function(id){
    const sql = "SELECT name FROM users WHERE UserId = ?";
    return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        })
    });
}

exports.getUserByUsername = function (username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE username = ?"
        db.all(sql, [username], (err, rows) => {
            console.log(rows);
            console.log("user_dao "+ username);
            if (err)
                reject(err);
            else if (rows.length !== 1)
                reject(undefined);
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};

const createUser = function(row){
    const username = row.Username;
    const id = row.UserId;
    const password = row.Password;
    const name = row.Name;

    return new User(id, username, password, name);
}

exports.checkPassword = function(user, password){
    console.log("hash of: " + password);
    //let hash = bcrypt.hashSync(password, 10);
    //console.log(hash);
    //console.log("DONE");

    return bcrypt.compareSync(password, user.password);
}
