const express = require('express');

const PORT = 3001;

app = new express()

// Authorization error
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };

const expireTime = 60*60 * 1000; // 1 hour
const jwtSecret = "notSoSecret";
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("express-jwt");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const moment = require("moment");
const {check, validationResult} = require('express-validator');

const userDao = require('./user_dao');
const vehicleDao = require('./vehicle_dao');
const requestDao = require('./request_dao');
const rentalDao = require('./rental_dao');


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
            let isValid = userDao.checkPassword(user, req.body.password);
            if (isValid) {
                const token = jsonwebtoken.sign({userId: user.id}, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, {httpOnly: true, sameSite: true, maxAge: expireTime});
                res.status(200).json({name: user.name}).send();
            } else
                res.status(401).end();
        })
        .catch((err) => {
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

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});

app.get('/api/vehicles/request', (req, res) => {
    //check again data
    if (req.query) {
        const request = req.query;
        if (checkData(request)) {
            requestNumberAndPrice(request, req.user.userId)
                .then(response => res.json(response))
                .catch(err => {console.log(err); res.status(500).json({error: err});});
            return;
        }
    }
    res.status(500).json({error: "invalid data"});
});

app.post('/api/rentals/payment', (req, res) => {
    const request = req.body.rentalData;
    const payment = req.body.paymentData;
   if(checkData(request) && checkPaymentData(payment)){
       requestNumberAndPrice(request, req.user.userId)
           .then((numberAndPrice) => {
               if(numberAndPrice && numberAndPrice.number > 0){
                   if(numberAndPrice.price == payment.price){
                       res.end();
                   }
               }
           })
           .catch((err) => {console.log(err); res.status(500).json({error: err});});
       return;
   }
    res.status(500).json({error: "invalid data"});
});

app.post("/api/rentals", (req, res) => {
    const request = req.body.rentalData;
    const price = req.body.price;
    if(checkData(request)){
        requestDao.chooseVehicle(request)
            .then((vehicleid) => rentalDao.insertRental(request, vehicleid, req.user.userId, price))
            .then(() => res.end())
            .catch((err) => {console.log(err); res.status(500).json({error: err});});
        return;
    }
    res.status(500).json({error: "invalid data"});
});

app.get("/api/rentals", (req, res) => {
    rentalDao.getRentals(req.user.userId)
        .then((response) => res.json(response))
        .catch((err) => res.status(500).json({error: err}));
});

app.delete("/api/rentals/:rentalid", [check('rentalid').isInt({min: 0})], (req, res) => {
    rentalDao.deleteRental(req.user.userId, req.params.rentalid)
        .then(() => res.end())
        .catch((err) => res.status(500).json({error: err}));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));


const checkData = (request) => {
    if (request.datein && request.dateout && moment(request.datein).isAfter(moment()) && moment(request.datein).isSameOrBefore(request.dateout)) {
        let regexCat = new RegExp("[A-E]");
        if (regexCat.test(request.category) && +request.kms !== -1 && +request.age !== -1 && +request.others >= 0) {
            return true;
        }
    }
    return false;
}

const checkPaymentData = (paymentData) => {
    const pattern = new RegExp("[0-9]+")
    const namePattern = new RegExp("[a-zA-Z ]+")

    if(paymentData.cvv && paymentData.cvv.length === 3 && pattern.test(paymentData.cvv)) { //cvv ok
        if(paymentData.month && pattern.test(paymentData.month) && +paymentData.month <= 12 && +paymentData.month >= 1){ //month ok
            if(paymentData.year && pattern.test(paymentData.year) && +paymentData.year  >= 20){ //year ok
                if(paymentData.name && namePattern.test(paymentData.name)){ //name ok
                    if(paymentData.number && paymentData.number.length === 16 && pattern.test(paymentData.number))
                        return true;
                }
            }
        }
    }
    return false;
}


const requestNumberAndPrice = (request, id) => {
   return Promise.all([requestDao.getAvailableVehicles(request), requestDao.getNumberByCategory(request.category), requestDao.getPreviousRentals(id)])
        .then((results) => {
            const numberAndPrice = results[0];
            if (numberAndPrice.number === 0) {
                return numberAndPrice;
            } else {
                const previousRentals = results[2];
                const totalCars = results[1];
                let price = calculatePrice(request, numberAndPrice, totalCars, previousRentals);
                numberAndPrice.price = price;
                return numberAndPrice;
            }
        });
}

const calculatePrice = (request, numberAndPrice, totalCars, previousRentals) => {
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