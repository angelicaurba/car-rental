const db = require("./db");
const Rental = require('./rental');

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

createRental = (request, vehicleid, userid, price) => {
    const rental = new Rental(request.datein, request.dateout, +request.age, +request.others, +request.kms, +request.insurance, vehicleid, userid, price);
    return rental;
}