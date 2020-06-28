const express = require('express');

const PORT = 3001;

app = new express();

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

app.use("/img", express.static("static/img"));

//GET /api/login
//Request params: none
//Response body: the name of the user in case of success, empty in case of insuccess (status code 401)
/*  this api is used to check if the user was already authenticated;
    the jwt middleware is used to pars the cookie, and with the property
    credentialsRequired set to false, the following callback is executed
    even if the token is not signed, so that the function can recognize
    if the user was authenticated or not
 */
app.get("/api/login", jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token,
    credentialsRequired: false
}), (req, res) => {
    if (req.user && req.user.userId) {
        userDao.getNameById(req.user.userId)
            .then((response) => res.status(200).json({name: response}).send())
            .catch(() => res.status(401).end());
    } else res.status(401).end();
});


//POST /api/login
//Request parameters: none
//Request body: an object containing username and password
//Response body: the name of the user in case of success, empty in case of insuccess (status code 401)
//this api is in charge to perform the login
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

//POST /api/logout
//Request parameters: none
//Request body: empty
//Response body: empty
app.post("/api/logout", (req, res) => {
    res.clearCookie('token').end();
});

//GET /api/vehicles
//Request parameters: none
//Request body: empty
//Response body: an array of Vehicle object, an error code in case of errors
app.get("/api/vehicles", (req, res) => {
    vehicleDao.getAllVehicles()
        .then((vehicles) => res.json(vehicles))
        .catch((err) => res.status(500).json({error: err}));
});

//from now on, all the requests will be checked to ensure that they arrive with a valid token
app.use(jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token
}));

/* To return a better object in case of errors,
 so that even if an error occurs, the json response can be parsed
 without having errors due to the attempt to parse an empty object
 */
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});


//GET /api/vehicles/request
//Request parameters: query parameters containing all the parameters set in the rentalForm
//Request body: none
//Response body: an object containing the number of available vehicles and the price basing on the received parameters
app.get('/api/vehicles/request', (req, res) => {
    //check again data
    if (req.query) {
        const request = req.query;
        if (checkData(request)) {
            requestNumberAndPrice(request, req.user.userId)
                .then(response => res.json(response))
                .catch(err => res.status(500).json({error: err}));
            return;
        }
    }
    res.status(500).json({error: "invalid data"});
});

//POST /api/rentals/payment
//Request parameters: none
//Request body: contains all the parameters of the rental request in the rentalData object
//and the payment data (credit card number, cvv...) plus the price to be payed in the paymentData object
//Response body: empty if everything ok, otherwise an object containing the error message
/*this api is just a stub that checks if the price to be payed is the right one,
if the rental request parameters are valid, and if the payment data are valid ones
 */
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
           .catch((err) => res.status(500).json({error: err}));
       return;
   }
    res.status(500).json({error: "invalid data"});
});

//POST /api/rentals
//Request parameters: none
//Request body: contains all the parameters of the rental request (rentalData) and the price that has been payed (price)
//Response body: empty if the rental has been correctly recorded in the db, otherwise an error message
app.post("/api/rentals", (req, res) => {
    const request = req.body.rentalData;
    const price = req.body.price;
    if(checkData(request)){
        requestDao.chooseVehicle(request)
            .then((vehicleid) => rentalDao.insertRental(request, vehicleid, req.user.userId, price))
            .then(() => res.end())
            .catch((err) => res.status(500).json({error: err}));
        return;
    }
    res.status(500).json({error: "invalid data"});
});

//GET /api/rentals
//Request parameters: none
//Request body: empty
//Response body: contains an array of Rental objects if everything ok, otherwise an error message
app.get("/api/rentals", (req, res) => {
    rentalDao.getRentals(req.user.userId)
        .then((response) => res.json(response))
        .catch((err) => res.status(500).json({error: err}));
});

//DELETE /api/rentals/:rentalid
//Request parameters: the id of the rental to delete
//Request body: empty
//Response body: empty if everything ok, otherwise an error message
app.delete("/api/rentals/:rentalid", [check('rentalid').isInt({min: 0})], (req, res) => {
    rentalDao.deleteRental(req.user.userId, req.params.rentalid)
        .then(() => res.end())
        .catch((err) => res.status(500).json({error: err}));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

//performs a server-side validation of the data received by the front-end
const checkData = (request) => {
    if (request.datein && request.dateout && moment(request.datein).isAfter(moment()) && moment(request.datein).isSameOrBefore(request.dateout)) { //dates ok
        let regexCat = new RegExp("[A-E]");
        if (regexCat.test(request.category) && +request.kms !== -1 && +request.age !== -1 && +request.others >= 0) {
            return true;
        }
    }
    return false;
}

//performs a check server-side of the payment data
const checkPaymentData = (paymentData) => {
    const pattern = new RegExp("[0-9]+")
    const namePattern = new RegExp("[a-zA-Z ]+")

    if(paymentData.cvv && paymentData.cvv.length === 3 && pattern.test(paymentData.cvv)) { //cvv ok
        if(paymentData.month && pattern.test(paymentData.month) && +paymentData.month <= 12 && +paymentData.month >= 1){ //month ok
            if(paymentData.year && pattern.test(paymentData.year) && +paymentData.year  >= (moment().year() - 2000)) { //year ok
                if (+paymentData.year > (moment().year() - 2000) || (+paymentData.year === moment().year() - 2000 && (+paymentData.month >= moment().month() + 1))) { //expiration date is valid (moment().month() starts from 0 so the +1 is needed)
                    if (paymentData.name && namePattern.test(paymentData.name)) { //name ok
                        if (paymentData.number && paymentData.number.length === 16 && pattern.test(paymentData.number)) //card number ok
                            return true;
                    }
                }
            }
        }
    }
    return false;
}

/*since the request to the db for retrieving number and price of available vehicles is done twice
(both in the GET /api/vehicles/request to send back those data
and in the POST /api/rentals/payment to check that the price sent by the client is the right one),
I wrote this function in order to avoid duplicated code
 */
const requestNumberAndPrice = (request, id) => {
   /* the three functions executed in parallel are in charge to retrieve respectively
        - the number and the price of the available vehicles
        - the number of total car for the chosen category
        - the number of past rentals for a given user
      in order to calculate the actual price of the rental
    */
   return Promise.all([requestDao.getAvailableVehicles(request), vehicleDao.getNumberByCategory(request.category), rentalDao.getPreviousRentals(id)])
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

/*basing on the parameters received by the previous function (requestNumberAndPrice)
and on the project's specifications, this function calculate the price for a given rental
 */
const calculatePrice = (request, numberAndPrice, totalCars, previousRentals) => {
    const kms_percentage = 1 + (+request.kms === 1 ? -5 : (+request.kms === 2 ? 0 : +5)) / 100;
    const age_percentage = 1 + (+request.age === 1 ? +5 : (+request.age === 2 ? 0 : +10)) / 100;
    const others_percentage = 1 + (request.others > 0 ? 15 : 0) / 100;
    const insurance_percentage = 1 + (+request.insurance === 1 ? 20 : 0) / 100;
    const prev_percentage = 1 + (previousRentals >= 3 ? -10 : 0) / 100;
    const totalCars_percentage = 1 + ( (numberAndPrice.number / totalCars) < 0.1 ? 10 : 0) / 100;
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