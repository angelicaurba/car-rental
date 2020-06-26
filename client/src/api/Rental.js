"use strict"

class Rental {
    constructor(datein, dateout, category, age, others, kms, insurance, vehicleid, userid, price, vehicle) {
        this.datein = datein;
        this.dateout = dateout;
        this.category = category;
        this.age = age;
        this.others = +others;
        this.kms = kms;
        this.insurance = +insurance;
        this.vehicleid = +vehicleid;
        this.userid = +userid;
        this.price = +price;
        this.vehicle = vehicle;
    }
}

export default Rental;