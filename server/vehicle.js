"use strict"

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