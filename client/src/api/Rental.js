

class Rental {
    constructor(rentalid, datein, dateout, category, age, others, kms, insurance, vehicleid, userid, price, vehicle) {
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
        this.rentalid = rentalid;
    }
}

export default Rental;