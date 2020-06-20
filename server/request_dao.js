const db = require("./db");
const Vehicle = require('./vehicle');

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
            ")";

        db.get(sql, [request.category, request.datein, request.datein, request.dateout, request.dateout], (err, row) => {
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

exports.getNumberByCategory = (category) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) AS number FROM vehicles WHERE Category = ?";
        db.get(sql, [category], (err, row) => {
            if (err)
                reject(err);
            else {
                resolve(row.number);
            }
        });
    });
}

exports.getPreviousRentals = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) as number FROM rentals WHERE UserId = ?";
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else {
                resolve(row.number);
            }
        });
    });
}

const createVehicle = function (row) {
    const id = row.VehicleId;
    const category = row.Category;
    const brand = row.Brand;
    const model = row.Model;

    return new Vehicle(id, category, brand, model);
}