const db = require("./db");
const Vehicle = require('./vehicle');

/* in this file there are the the sql queries
that involve both the rentals and the vehicles tables
 */

//retrieve the number and the price of the available vehicles, given the category and the period of rental
exports.getAvailableVehicles = function (request) {
    return new Promise(((resolve, reject) => {
        const sql = "SELECT COUNT(*) as number " +
            "FROM vehicles " +
            "WHERE Category = ? AND " +
            "VehicleId NOT IN (" +
            "SELECT VehicleId " +
            "FROM rentals " +
            "WHERE ( ? >= DateFrom AND ? <= DateTo ) " +
            "OR ( ? >= DateFrom AND ? <= DateTo ) " +
            " OR ( ? >= DateFrom AND ? <= DateTo ) ) ";

        db.get(sql, [request.category, request.datein, request.datein, request.dateout, request.dateout, request.datein, request.dateout], (err, row) => {
            if (err) {
                reject(err);
            } else {
                let number = row.number;
                let price = -1;
                if (number > 0) {
                    price = createVehicle({Category: request.category}).price;
                }
                const numberAndPrice = {
                    number: number,
                    price: price
                }
                resolve(numberAndPrice);
            }
        });

    }));
}

//selects the first vehicle among the available ones and returns its id
exports.chooseVehicle = (request) => {
    const sql = "SELECT * " +
        "FROM vehicles " +
        "WHERE Category = ? AND " +
        "VehicleId NOT IN (" +
        "SELECT VehicleId " +
        "FROM rentals " +
        "WHERE ( ? >= DateFrom AND ? <= DateTo ) " +
        "OR ( ? >= DateFrom AND ? <= DateTo ) " +
        "OR ( ? >= DateFrom AND ? <= DateTo ) ) LIMIT 1 ";
    return new Promise((resolve, reject) => {
        db.get(sql, [request.category, request.datein, request.datein, request.dateout, request.dateout, request.datein, request.dateout], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.VehicleId);
            }
        });
    });
}

/*
just call the constructor of the Vehicle class in a cleaner way
 */
const createVehicle = function (row) {
    const id = row.VehicleId;
    const category = row.Category;
    const brand = row.Brand;
    const model = row.Model;

    return new Vehicle(id, category, brand, model);
}