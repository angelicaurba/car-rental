const db = require("./db");
const bcrypt = require('bcrypt');
const User = require('./user');

/*
* if the user was already authenticated, the token already has his/her id
* and just needs to retrieve his/her name to give it to the front-end
* */
exports.getNameById = function(id){
    const sql = "SELECT name FROM users WHERE UserId = ?";
    return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.Name);
        })
    });
}

/*
given a username, returns the user field to check the credentials
 */
exports.getUserByUsername = function (username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE username = ?"
        db.all(sql, [username], (err, rows) => {
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

//checks if the password is correct
exports.checkPassword = function(user, password){
    return bcrypt.compareSync(password, user.password);
}
