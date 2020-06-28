import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Button, Navbar, Image} from 'react-bootstrap';
import { FaRegUser, FaCarSide, FaUserAltSlash, FaShoppingCart } from 'react-icons/fa';
import logo from "../car-rental.svg"

function AppNavbar(props) {
        const location = useLocation();

        return <Navbar sticky={"top"} className={"appNavbar row"} bg="primary" expand="true">
            <Link to={"/catalogue"} className={"col-5 col-md-3 row"}><Navbar.Brand className={"row"}>
                <Image src={logo} className={"col-8 col-sm-6"} height={50} rounded/>
                <span className={"col-5 d-sm-inline d-none"}>Rentals.com</span>
            </Navbar.Brand></Link>
            {props.loggedIn === true && !location.pathname.endsWith("/login") && props.name ?
                <span className={"col-3 d-md-inline d-none"}><h6>Welcome {props.name}!</h6></span>
                :
                null
            }
            <div className={"col-7 col-md-5 row d-flex justify-content-end"}>
                {location.pathname.includes("newrental") ?
                    <Link to={"/user/rentals/future"} className={"col-6 col-lg-5"}>
                        <Button className={"row"} variant="outline-light">
                            <FaCarSide className={"col-12"}/>
                            <span className={"col-12 d-sm-block d-none"}>Your rentals</span>
                        </Button>{" "}
                    </Link>
                    :
                    (location.pathname.includes("rentals") )|| (location.pathname.includes("catalogue") && props.loggedIn) ?
                        <Link to={"/user/newrental"} className={"col-6 col-lg-5"}>
                            <Button className={"row"} variant="outline-light">
                                <FaShoppingCart className={"col-12"}/>
                                <span className={"col-12 d-sm-block d-none"}>Rent a car</span>
                            </Button>{" "}
                        </Link>
                        :
                        null
                }
            {props.loggedIn === true ?
                <Link to={"/"} className={"col-6 col-md-4"}>
                    <Button className={"row"} variant="outline-light" onClick={()=>props.setLogout()}>
                        <FaUserAltSlash className={"col-12"}/>
                        <span className={"col-6 d-sm-inline d-none"}>Logout</span>
                    </Button>
                </Link>
                :
                props.loggedIn === false && location.pathname.endsWith("/login") ?
                    null
                    :
                    <Link to={"/login"} className={"col-6 col-md-4 ml-2"}>
                        <Button className={"row"} variant="outline-light">
                            <FaRegUser className={"col-12"}/>
                            <span className={"col-6 d-sm-inline d-none"}>Login</span>
                        </Button>
                    </Link>
            }
            </div>
        </Navbar>;
    }


export default AppNavbar;