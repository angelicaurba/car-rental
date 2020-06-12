import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import AppNavbar from './components/AppNavbar'
import Catalogue from './components/Catalogue'
import LoginForm from "./components/LoginForm";
import * as API from "./api/API.js";
import './App.css';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {loggedIn : false,
                    user:{
                        username: "",
                        password: "",
                        name: ""
                    },
            loading: true,
            vehicles: []
        };
    }

    componentDidMount() {
        API.getAllVehicles()
            .then((result) => this.setState({vehicles: [...result], loading: false}))
            .catch(err => console.log(err));
    }

    changeUserField = (name,value) => {
        this.setState((state) => {
            let tmp = {...state.user};
            tmp[name] = value;
            return {user: tmp};
        });
    }

    setLogin = () => {this.setState({loggedIn: true})}
    setLogout = () => {
        this.setState({loggedIn: false});
        API.logout();
    }

    login = (username, password) => {
        return API.login(username, password)
            .then((response) => {
                if(response.name){
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
            <div className="App">
                <Router>
                    <Route path={"/"} render={()=><AppNavbar setLogout={this.setLogout} name={this.state.user.name} loggedIn={this.state.loggedIn}/>}/>
                        <Switch>
                            <Route exact path={"/login"} render={()=>{
                                if(this.state.loggedIn === false)
                                    return <LoginForm login={this.login} setLogin={this.setLogin} change={this.changeUserField} username={this.state.user.username} password={this.state.user.password}/>;
                                else return <Redirect to={"/user/newrental"}></Redirect>
                            }}/>
                        <Route exact path={"/catalogue"} render={()=>{
                                return <Catalogue vehicles={this.state.vehicles}/>;
                        }}/>
                            <Route exact path={"/user/newrental"} render={()=>{
                                if(this.state.loggedIn === false)
                                    return <Redirect to={"/login"}></Redirect>;
                            }}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
