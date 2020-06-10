import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import AppNavbar from './components/AppNavbar'
import Catalogue from './components/Catalogue'
import LoginForm from "./components/LoginForm";
import './App.css';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {loggedIn : false,
                    user:{
                        username: "",
                        password: "",
                        name: ""
                    }
        };
    }

    changeUserField = (name,value) => {
        this.setState((state) => {
            let tmp = {...state.user};
            tmp[name] = value;
            return {user: tmp};
        });
    }

    render() {
        return (
            <div className="App">
                <Router>
                    <Route path={"/"} render={()=><AppNavbar loggedIn={this.state.loggedIn}/>}/>
                        <Switch>
                            <Route exact path={"/login"} render={()=>{
                                if(this.state.loggedIn === false)
                                    return <LoginForm change={this.changeUserField} username={this.state.username} password={this.state.password}/>;
                                else return <Redirect to={"/user/newrental"}></Redirect>
                            }}/>
                        <Route exact path={"/catalogue"} render={()=>{
                            if(this.state.loggedIn === false)
                                return <Catalogue></Catalogue>;
                            else return <Redirect to={"/user/newrental"}></Redirect>
                        }}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
