const db = require("./db");
const Rental = require('./rental');
const Vehicle = require('./vehicle');

exports.insertRental = (request, vehicleid, userid, price) => {
    const sql = "INSERT INTO rentals (UserId,VehicleId, DateFrom, DateTo, AgeDriver, OtherDrivers, Kilometers, Insurance, Price) " +
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
    const rental = createRental(request, vehicleid, userid, price);
    return new Promise((resolve, reject) => {
        db.run(sql, [rental.userid, rental.vehicleid, rental.datein, rental.dateout, rental.age, rental.others, rental.kms, rental.insurance, rental.price], (err) => {
            if (err)
                reject(err);
            resolve();
        });
    });

}

exports.getRentals = (id) => {
    const sql = "SELECT * from rentals, vehicles " +
        "WHERE rentals.VehicleId = vehicles.VehicleId AND UserId = ? ";
    return new Promise((resolve, reject) => {
        db.all(sql, [id], (err, rows) => {
            if(err)
                reject(err);
            else {
                const rentals = rows.map(row => {
                    console.log(row);
                    let rental = new Rental(row.DateFrom, row.DateTo, row.Category, row.AgeDriver, row.OtherDrivers, row.Kilometers, row.Insurance, row.VehicleId, row.UserId, row.Price);
                    let vehicle = new Vehicle(row.VehicleId, row.Category, row.Brand, row.Model);
                    console.log(rental);
                    rental = rental.toDto(vehicle);
                    console.log(rental);
                    return rental;
                });
                resolve(rentals);
            }
        });
    });
}

createRental = (request, vehicleid, userid, price) => {
    const rental = new Rental(request.datein, request.dateout, +request.age, +request.others, +request.kms, +request.insurance, vehicleid, userid, price);
    return rental;
}