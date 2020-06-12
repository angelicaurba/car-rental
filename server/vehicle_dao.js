const db = require("./db");
const Vehicle = require('./vehicle');

exports.getAllVehicles = function (username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM vehicles"
        db.all(sql, (err, rows) => {
            if (err)
                reject(err);
            else{
                const vehicles = rows.map(row => createVehicle(row));
                resolve(vehicles);
            }
        });
    });
};

const createVehicle = function(row){
    const id = row.VehicleId;
    const category = row.Category;
    const brand = row.Brand;
    const model = row.Model;

    return new Vehicle(id, category, brand, model);
}

