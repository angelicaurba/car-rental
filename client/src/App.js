import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import AppNavbar from './components/AppNavbar'
import Catalogue from './components/Catalogue'

import './App.css';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {loggedIn : false};
    }
    render() {
        return (
            <div className="App">
                <Router>
                    <Route path={"/"} render={()=><AppNavbar loggedIn={this.state.loggedIn}/>}/>
                        <Switch>
                        <Route exact path={"/catalogue"} render={()=>{
                            if(this.state.loggedIn === false)
                                return <Catalogue></Catalogue>;
                            else return <Redirect to={"/user/newrental"}></Redirect>
                        }}></Route>
                        <Route exact to={"/login"}></Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
