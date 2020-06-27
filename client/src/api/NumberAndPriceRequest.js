

class NumberAndPriceRequest{

    constructor(datein, dateout, category, age, others, kms, insurance){
        this.datein = datein;
        this.dateout = dateout;
        this.category = category;
        this.age = age;
        this.others = others;
        this.kms = kms;
        this.insurance = insurance;
    }

}

export default NumberAndPriceRequest;