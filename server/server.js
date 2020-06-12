const express = require('express');

const PORT = 3001;

app = new express();

const expireTime = 50*1000; //seconds
const jwtSecret = "notSoSecret";
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("express-jwt");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const userDao = require('./user_dao');
const vehicleDao = require('./vehicle_dao');

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

app.use(cookieParser());

//GET /api/login
//Request body: empty
//Response body: the user name in case of success, empty in case of insuccess
//this api is used to check if the user was already authenticated
app.get("/api/login", jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token,
    credentialsRequired: false
}), (req, res) => {
    console.log("the user was already auth?");
    if(req.user && req.user.userId){
        console.log("UserId : " + req.user.userId);
        userDao.getNameById(req.user.userId)
            .then((response) => res.status(200).json({name: response}).send())
            .catch(() => res.status(401).end() );
    }
    else res.status(401).end();
});

app.post("/api/login", (req, res) => {
    console.log("server.js POST login req.body ");
    console.log(req.body);
    userDao.getUserByUsername(req.body.username)
        .then((user) => {
            console.log("server.js POST login " + user);
            let isValid = userDao.checkPassword(user, req.body.password);
            console.log(isValid);
            if (isValid) {
                const token = jsonwebtoken.sign({userId: user.id}, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, {httpOnly: true, sameSite: true, maxAge: expireTime});
                res.status(200).json({name: user.name}).send();
            }
            else
            res.status(401).end();
        })
        .catch((err) => {
            console.log("POST api login");
            console.log(err);
            res.status(401).end();});
});

app.get("/api/vehicles", (req, res) => {
    vehicleDao.getAllVehicles()
        .then((vehicles) => res.json(vehicles))
        .catch((err) => res.status(500).json({error: err}));
});

app.use(jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token
}));



app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));