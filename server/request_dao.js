const db = require("./db");
const Vehicle = require('./vehicle');

exports.getAvailableVehicles = function(request){
    return new Promise(((resolve, reject) => {
        const sql = "SELECT * " +
                    "FROM vehicles" +
                    "WHERE Category = ? AND " +
                    "VehicleId NOT IN (" +
                                        "SELECT VehicleId " +
                                        "FROM rentals " +
                                        "WHERE ( ? >= DateFrom AND ? <= DateTo ) " +
                                        "OR ( ? >= DateFrom AND ? <= DateTo ) " +
                                    ")";
        db.all(sql, [request.category, request.datein, request.datein, request.dateout, request.dateout], (err, rows) => {
            if (err)
                reject(err);
            else{
                let number = rows.count();
                let price = -1;
                if(number > 0){
                    price = createVehicle(row[0]).price;
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

//TODO: add query to get the number of cars of a given category

const createVehicle = function(row){
    const id = row.VehicleId;
    const category = row.Category;
    const brand = row.Brand;
    const model = row.Model;

    return new Vehicle(id, category, brand, model);
}