import Vehicle from "./Vehicle";

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

    if(response.ok){
        return vehicles.map(v => new Vehicle(v.id, v.category, v.brand, v.model, v.price));
    }
    else{
        let retErr = {status: response.status, err: vehicles};
        throw retErr;
    }

}

export {tryLogin, login, logout, getAllVehicles}