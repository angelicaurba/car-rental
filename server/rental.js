"use strict"

class Rental {
    constructor(datein, dateout, category, age, others, kms, insurance, vehicleid, userid, price){
        this.datein = datein;
        this.dateout = dateout;
        this.category = category;
        this.age = +age;
        this.others = +others;
        this.kms = +kms;
        this.insurance = +insurance;
        this.vehicleid = +vehicleid;
        this.userid = +userid;
        this.price = +price;
    }

    toDto = (vehicle, rentalid) => {
        let dto = {...this};
        const age = dto.age;
        switch (age) {
            case 1: dto.age = "18 - 24"; break;
            case 2: dto.age = "25 - 64"; break;
            case 3: dto.age = "65 +"; break;
        }

        const kms = dto.kms;
        switch (kms) {
            case 1: dto.kms = "0 - 49 km/day"; break;
            case 2: dto.kms = "50 - 149 km/day"; break;
            case 3: dto.kms = "unlimited"; break;
        }

        dto.vehicle = vehicle;
        dto.rentalid = rentalid;

        return dto;
    }
}

module.exports = Rental;