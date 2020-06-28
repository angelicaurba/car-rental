"use strict"


/*
* this class hide the calculus of the base price
* that is based on the car's category;
* only this class and the calculatePrice in server.js are in charge to decide the price
* */
class Vehicle {
    constructor(id, category, brand, model){
        this.id = id;
        this.category = category;
        this.brand = brand;
        this.model = model;
        switch (category) {
            case "A": this.price = 80; break;
            case "B": this.price = 70; break;
            case "C": this.price = 60; break;
            case "D": this.price = 50; break;
            case "E": this.price = 40; break;
        }
    }
}

module.exports = Vehicle;