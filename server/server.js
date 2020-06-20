const express = require('express');

const PORT = 3001;

app = new express();

const expireTime = 50000 * 1000; //seconds
const jwtSecret = "notSoSecret";
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("express-jwt");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const moment = require("moment");

const userDao = require('./user_dao');
const vehicleDao = require('./vehicle_dao');
const requestDao = require('./request_dao');

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
    if (req.user && req.user.userId) {
        console.log("UserId : " + req.user.userId);
        userDao.getNameById(req.user.userId)
            .then((response) => res.status(200).json({name: response}).send())
            .catch(() => res.status(401).end());
    } else res.status(401).end();
});

app.post("/api/login", (req, res) => {
    if (!req.body.username || !req.body.password)
        res.status(401).end();
    userDao.getUserByUsername(req.body.username)
        .then((user) => {
            console.log("server.js POST login " + user);
            let isValid = userDao.checkPassword(user, req.body.password);
            console.log(isValid);
            if (isValid) {
                const token = jsonwebtoken.sign({userId: user.id}, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, {httpOnly: true, sameSite: true, maxAge: expireTime});
                res.status(200).json({name: user.name}).send();
            } else
                res.status(401).end();
        })
        .catch((err) => {
            console.log("POST api login");
            console.log(err);
            res.status(401).end();
        });
});

app.post("/api/logout", (req, res) => {
    res.clearCookie('token').end();
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


app.get('/api/vehicles/request', (req, res) => {
    //check again data
    if (req.query) {
        const request = req.query;
        if (checkData(request)) {
            Promise.all([requestDao.getAvailableVehicles(request), requestDao.getNumberByCategory(request.category), requestDao.getPreviousRentals(req.user.userId)])
                .then((results) => {
                    const numberAndPrice = results[0];
                    if (numberAndPrice.number === 0) {
                        res.json(numberAndPrice);

                    } else {
                        const previousRentals = results[2];
                        const totalCars = results[1];
                        let price = calculatePrice(request, numberAndPrice, totalCars, previousRentals);
                        numberAndPrice.price = price;
                        res.json(numberAndPrice);
                    }
                })
                .catch(err => res.status(500).json({error: err}));
            return;
        }
    }
    res.status(500).json({error: "invalid data"});
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));


checkData = (request) => {
    if (request.datein && request.dateout && moment(request.datein).isAfter(moment()) && moment(request.datein).isSameOrBefore(request.dateout)) {
        let regexCat = new RegExp("[A-E]");
        if (regexCat.test(request.category) && +request.kms !== -1 && +request.age !== -1 && +request.others >= 0) {
            return true;
        }
    }
}

calculatePrice = (request, numberAndPrice, totalCars, previousRentals) => {
    const kms_percentage = 1 + (request.kms == 1 ? -5 : (request.kms == 2 ? 0 : +5)) / 100;
    const age_percentage = 1 + (request.age == 1 ? +5 : (request.age == 2 ? 0 : +10)) / 100;
    const others_percentage = 1 + (request.others > 0 ? 15 : 0) / 100;
    const insurance_percentage = 1 + (request.insurance == 1 ? 20 : 0) / 100;
    const prev_percentage = 1 + (previousRentals >= 3 ? -10 : 0) / 100;
    const totalCars_percentage = 1 + (numberAndPrice.number / totalCars < 0.1 ? 10 : 0);
    const days = moment(request.dateout).diff(moment(request.datein), 'days') + 1;

    const price = numberAndPrice.price
        * kms_percentage
        * age_percentage
        * others_percentage
        * insurance_percentage
        * prev_percentage
        * totalCars_percentage
        * days;

    return price;
}