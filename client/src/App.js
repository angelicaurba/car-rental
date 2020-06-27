import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import AppNavbar from './components/AppNavbar'
import Catalogue from './components/Catalogue'
import LoginForm from "./components/LoginForm";
import UserArea from "./components/UserArea";
import * as API from "./api/API.js";
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: undefined,
            //trick to avoid that a late update to true
            // causes the application to go to the rentalform page
            user: {
                username: "",
                password: "",
                name: ""
            },
            loading: false,
            vehicles: []
        };
    }

    componentDidMount() {
        this.setState({loading: true});
        API.getAllVehicles()
            .then((result) => this.setState({vehicles: [...result], loading: false}))
            .catch(err => console.log(err));

        API.tryLogin()
            .then((response) => {
                if (response.name) {
                    this.changeUserField("name", response.name);
                    this.setLogin();
                }
                else this.setState({loggedIn: false});
            })
            .catch(() => this.setState({loggedIn: false}));
    }

    changeUserField = (name, value) => {
        this.setState((state) => {
            let tmp = {...state.user};
            tmp[name] = value;
            return {user: tmp};
        });
    }

    setLogin = () => {
        this.setState({loggedIn: true})
    }
    setLogout = () => {
        this.setState({loggedIn: false});
        API.logout();
    }
    setLoggedout = () => {
        this.setState({loggedIn: false});
    }

    login = (username, password) => {
        return API.login(username, password)
            .then((response) => {
                if (response.name) {
                    this.setState((state) => {
                        let tmp = {username: "", password: ""};
                        tmp.name = response.name;
                        return {user: tmp, loggedIn: true};
                    });
                    return true;
                }
            })
            .catch(() => false);
    }

    render() {
        return (
            <div className="App container-fluid">
                <Router>
                    <Route path={"/"} render={() => <AppNavbar setLogout={this.setLogout} name={this.state.user.name}
                                                               loggedIn={this.state.loggedIn}/>}/>
                    <Switch>
                        <Route exact path={"/login"} render={() => {
                            if (this.state.loggedIn === false)
                                return <LoginForm login={this.login}
                                                  change={this.changeUserField} username={this.state.user.username}
                                                  password={this.state.user.password}/>;
                            else return <Redirect to={"/user/newrental"}></Redirect>
                        }}/>
                        <Route exact path={"/catalogue"} render={() => {
                            return <Catalogue loading={this.state.loading} vehicles={this.state.vehicles}/>;
                        }}/>
                        <Route path={"/user/"} render={() => {
                            if (this.state.loggedIn === false)
                                return <Redirect to={"/login"}></Redirect>;
                            else
                                return <UserArea setLoggedout={this.setLoggedout}/>
                        }}/>
                        <Route path={"/"} render={() => <Redirect to={"/catalogue"}></Redirect>}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
