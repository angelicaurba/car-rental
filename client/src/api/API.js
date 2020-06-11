

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
    console.log("login API username + password "+ username + " + " + password);
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

export {tryLogin, login}