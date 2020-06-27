import Vehicle from "./Vehicle";
import Rental from "./Rental";

async function tryLogin(){
    return new Promise((resolve, reject) => {
        fetch("/api/login")
            .then((result) => {
                if(result.ok && result.status === 200)
                    return result.json();
                else
                    reject();
            })
            .then((response) => {
                if(response.name)
                    resolve(response);
                else reject();
            } )
            .catch(() => reject());
    });
}

async function login(username, password){
    return new Promise((resolve, reject) => {
        fetch("/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password})
        })
            .then((result) => {
                if(result.ok && result.status === 200)
                    return result.json();
                else
                    reject();
            })
            .then((response) => resolve(response) )
            .catch((err) => reject(err));
    });
}

function logout(){
    fetch("/api/logout", { method: 'POST'});
}

async function getAllVehicles(){
    const response = await fetch("/api/vehicles");
    let vehicles = await response.json();

    if(response.ok && response.status === 200){
        return vehicles.map(v => new Vehicle(v.id, v.category, v.brand, v.model, v.price));
    }
    else{
        let retErr = {status: response.status, err: vehicles};
        throw retErr;
    }
}

async function retrieveNumberAndPrice(request){
    const url = '/api/vehicles/request?'+ Object.entries(request)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&');
    const response = await fetch(url, {
            method: 'GET'});
    const numberAndPrice = await response.json();
    if(response.ok && response.status === 200){
        return numberAndPrice;
    }
    else{
        let retErr = {status: response.status, err: numberAndPrice};
        throw retErr;
    }
}

async function handlePayment(paymentData, rentalData){ //payment data also contains the price to be payed
    //fetch post api for payment
    const paymentresponse = await fetch("/api/rentals/payment", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({paymentData: paymentData, rentalData: rentalData})
    });
    if(paymentresponse.ok && paymentresponse.status === 200){
        //fetch post api for rental
        const bookingresponse = await fetch("/api/rentals", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({price: paymentData.price, rentalData: rentalData})
        });
        if(bookingresponse.ok && bookingresponse.status === 200)
            return;
        else
            throw {status: paymentresponse.status, message: "invalid payment"};
    }
    else{
        throw {status: paymentresponse.status, message: "invalid payment"};
    }
}

async function getRentals(){
    const response = await fetch("/api/rentals");
    let rentals = await response.json();

    if(response.ok && response.status === 200){
        return rentals.map( rental => new Rental(rental.rentalid, rental.datein, rental.dateout, rental.category, rental.age, rental.others, rental.kms, rental.insurance, rental.vehicleid, rental.userid, rental.price, rental.vehicle));
    }
    else{
        let retErr = {status: response.status, err: rentals};
        throw retErr;
    }
}

async function deleteRental(rentalid){
    const response = await fetch("/api/rentals/"+rentalid, {
        method: 'DELETE'
    });
    if(response.ok && response.status === 200){
        return;}
    else{
        let retErr = {status: response.status};
        throw retErr;
    }

}


export {tryLogin, login, logout, getAllVehicles, retrieveNumberAndPrice, handlePayment, getRentals, deleteRental}