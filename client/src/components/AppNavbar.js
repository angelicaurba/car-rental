import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Button, Navbar} from 'react-bootstrap';
import { FaRegUser, FaCarSide, FaUserAltSlash } from 'react-icons/fa';

const logo = <svg height="50" viewBox="0 0 58 58" width="50" xmlns="http://www.w3.org/2000/svg"><g id="Page-1" fill="none" fillRule="evenodd"><g id="034---Give-Rental-Car" fillRule="nonzero"><path id="Shape" d="m56.68 44.57-18.74 11.43c-1.0988668.6603717-2.3579861 1.0062836-3.64 1l-27.3.0000841 2-22.0000841h2.8c2.0714875.0029748 4.0808028.7079977 5.7 2s3.6285125 1.9970252 5.7 2h5.23c1.7577186-.0003688 3.3865327.9222462 4.29 2.43l.09.15c.8410489 1.4274089.6152215 3.2422401-.55 4.42h2.35c.431998.000277.8610859-.0706746 1.27-.21l18.51-6.17c1.1289069-.3576453 2.3601528.0447226 3.06 1 .4545747.6154245.6300343 1.393361.4836428 2.1443304s-.6011976 1.4060439-1.2536428 1.8056696z" fill="#fdd7ad"/><path id="Shape" d="m33.27 43.9999997c-.1098783.7567661-.4605144 1.4580382-1 2.0000003h-6.55c-1.5798458-.0015392-3.1247785.4647243-4.44 1.34l-.72.49c-.1655373.1112428-.3605573.1704453-.56.17-.3326261.0005011-.6437296-.1644212-.83-.44-.1488534-.2200282-.2040417-.4902421-.1533875-.7510177.0506543-.2607756.2029878-.4906795.4233875-.6389823l.73-.49c1.6434687-1.0958612 3.574677-1.6804431 5.55-1.68z" fill="#f9c795"/><path id="Shape" d="m52 18h-26l3.45-6.89c.33773-.6796577 1.031056-1.1095973 1.79-1.11h15.52c.758944.0004027 1.45227.4303423 1.79 1.11l1.11 2.21z" fill="#67b9cc"/><path id="Shape" d="m52 18h-25.88c3.54-3.17 10.27-6.81 21.71-5 .64.1 1.25.21 1.83.32z" fill="#2fa8cc"/><path id="Shape" d="m18 26v-6c0-1.1045695.8954305-2 2-2h34c1.1045695 0 2 .8954305 2 2v6z" fill="#e64c3c"/><path id="Shape" d="m34 23h-2c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h2c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1z" fill="#95a5a5"/><path id="Shape" d="m45 23h-2c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h2c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1z" fill="#95a5a5"/><path id="Shape" d="m39 27c-.5522847 0-1-.4477153-1-1v-4c0-.5522847.4477153-1 1-1s1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1z" fill="#c03a2b"/><path id="Rectangle-path" d="m38 10h2v8h-2z" fill="#e64c3c"/><path id="Shape" d="m23 18v2c0 1.1045695-.8954305 2-2 2h-3v-2c0-1.1045695.8954305-2 2-2z" fill="#f0c419"/><path id="Shape" d="m53 30h3c1.1045695 0 2-.8954305 2-2s-.8954305-2-2-2h-38c-1.1045695 0-2 .8954305-2 2s.8954305 2 2 2z" fill="#95a5a5"/><rect id="Rectangle-path" fill="#955ba5" height="25" rx="2" width="9" y="33"/><path id="Shape" d="m13.0000516 9.59-.0000516 3.2c.0019661.1355858-.0523416.2659244-.15.36l-1.5 1.5c-.1905714.1944218-.1905714.5055782 0 .7l1.3 1.3c.1905714.1944218.1905714.5055782 0 .7l-1.3 1.3c-.1905714.1944218-.1905714.5055782 0 .7l1.5 1.5c.0976584.0940756.1519661.2244142.15.36v2.12c0 .2163702-.0701779.4269038-.2.6l-2 2.67c-.1888544.2518058-.4852427.4-.8.4s-.61114562-.1481942-.8-.4l-2-2.67c-.12982213-.1730962-.2-.3836298-.2-.6v-13.74z" fill="#f3d55b"/><circle id="Oval" cx="26.5" cy="29.5" fill="#3f5c6c" r="4.5"/><circle id="Oval" cx="26.5" cy="29.5" fill="#7f8c8d" r="2.5"/><circle id="Oval" cx="48.5" cy="29.5" fill="#3f5c6c" r="4.5"/><circle id="Oval" cx="48.5" cy="29.5" fill="#7f8c8d" r="2.5"/><path id="Shape" d="m6 0h8c1.1045695 0 2 .8954305 2 2v3c0 2.76142375-2.2385763 5-5 5h-2c-2.76142375 0-5-2.23857625-5-5v-3c0-1.1045695.8954305-2 2-2z" fill="#e64c3c"/><path id="Shape" d="m11 5h-2c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1h2c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1z" fill="#c03a2b"/></g></g></svg>;

function AppNavbar(props) {
        const location = useLocation();

        return <Navbar className={"row"} bg="primary" expand="true">
            <Navbar.Brand className={"col-3 row"}>
                <span className={"col-3"}>{logo}</span>
                <span className={"col-7"}>Rentals.com</span>
            </Navbar.Brand>
            {props.loggedIn === true && !location.pathname.endsWith("/login") ?
                <span className={"col-3 d-md-inline d-none"}><h6>Welcome User!</h6></span>
                :
                null
            }
            <div className={"col-6 col-md-5 row"}>
                {location.pathname.endsWith("newrental") ?
                    <Link to={"/user/rentals"} className={"col-6"}>
                        <Button className={"row"} variant="outline-light">
                            <FaCarSide className={"col-12"}/>
                            <span className={"col-12 d-sm-inline d-none"}>Your rentals</span>
                        </Button>
                    </Link>
                    :
                    (location.pathname.endsWith("rentals")) ?
                        <Link to={"/user/newrental"} className={"col-6"}>
                            <Button className={"row"} variant="outline-light">
                                <FaCarSide className={"col-12"}/>
                                <span className={"col-12 d-sm-inline d-none"}>Rent a car</span>
                            </Button>
                        </Link>
                        :
                        null
                }
            {props.loggedIn === true ?
                <Link to={"/"} className={"col-5 col-md-4 ml-2"}>
                    <Button className={"row"} variant="outline-light" onClick={()=>props.setLogout()}>
                        <FaUserAltSlash className={"col-12"}/>
                        <span className={"col-6 d-sm-inline d-none"}>Logout</span>
                    </Button>
                </Link>
                :
                props.loggedIn === false && location.pathname.endsWith("/login") ?
                    null
                    :
                    <Link to={"/login"} className={"col-5 col-md-4 ml-2"}>
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