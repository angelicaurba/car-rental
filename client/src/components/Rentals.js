import React, {useEffect, useState} from "react";
import moment from 'moment';
import {Alert, Button, Card, Col, Container, Image, ListGroup, Nav, Row} from "react-bootstrap";
import {NavLink, Redirect, Route} from 'react-router-dom';
import {RiDeleteBinLine} from "react-icons/ri";
import * as api from '../api/API'

function Rentals(props) {
    const [rentals, setRentals] = useState([]);
    const [error, setError] = useState(false);
    useEffect(() => {api.getRentals()
        .then((rentals) => {
            setRentals(rentals);
            setError(false);
        })
        .catch((error) => {
            if (error.status === 401) {
                //unauthorized, the token expired
                props.setLoggedout();
            } else {
                setError(true);
            }
        }); }, [])

    const previous = rentals.filter(rental => moment(rental.dateout).isSameOrBefore(moment(), "day"));
    const future = rentals.filter(rental => moment(rental.dateout).isAfter(moment(), "day"));

    return <>
        <Row>
            <Col md={3}>
                <Container className={"jumbotron"}><Sidebar/></Container>
            </Col>
            <Col md={9}>
                <Route exact path={"/user/rentals/:when"} render={({match}) => {
                    return match.params.when != "past" && match.params.when != "future" ?
                        <Redirect to={"/user/rentals/future"}/>
                        :
                        <RentalList error={error} rentals={match.params.when == "future" ? future : previous}/>
                }}>
                </Route>
            </Col>
        </Row>
    </>

}

function RentalList(props) {
    return props.rentals.length === 0 ?
        <Card className={"minHeight align-items-center d-flex justify-content-center"}><ListGroup>
            <Alert variant={"secondary"} style={{width: '40vw', alignContent: "center"}}>
                <Alert.Heading>{"There are no rentals in this section"}</Alert.Heading>
            </Alert></ListGroup></Card>
        :
        props.error ?
            <Card className={"minHeight align-items-center d-flex justify-content-center"}><ListGroup>
                <Alert variant={"danger"} style={{width: '40vw', alignContent: "center"}}>
                    {"Something went wrong! Reload the page or try again"}
                </Alert>
            </ListGroup></Card>
            :
            <Card className={"minHeight"}><ListGroup>
                {props.rentals.map((rental, index) => <RentalRow key={index} rental={rental}/>)}
            </ListGroup></Card>
}

function RentalRow(props) {
    let img = rental.vehicle.brand.toLowerCase().split(" ").join("-")
        +  rental.vehicle.model.toLowerCase().split(" ").join("-"); //TODO nome file corretto!!

    return <ListGroup.Item className={"rentalRow"} ><Row className={"align-items-center d-flex justify-content-left"}>
        <Col sm={4}>
            <Image className={"img-fluid"} src="/img/prova.png" rounded thumbnail/>
        </Col>
        <Col sm={3} className={"text-left"}>
            <span className={"d-block"}><strong>From: </strong>{moment(props.rental.datein).format("yyyy-MM-DD")}</span>
            <span className={"d-block"}><strong>To: </strong>{moment(props.rental.dateout).format("yyyy-MM-DD")}</span>
            <span className={"d-block"}><strong>Kms: </strong>{props.rental.kms}</span>
            <span className={"d-block"}><strong>Category: </strong>{props.rental.vehicle.category}</span>
            <span
                className={"d-block"}><strong>Vehicle: </strong>{props.rental.vehicle.brand + " " + props.rental.vehicle.model}</span>
        </Col>
        <Col sm={3} className={"text-left"}>
            <span className={"d-block"}><strong>Driver's age: </strong>{props.rental.age}</span>
            <span className={"d-block"}><strong>Other drivers: </strong>{props.rental.others}</span>
            <span className={"d-block"}><strong>Extra insurance: </strong>{props.rental.insurance ? "yes" : "no"}</span>
            <span className={"d-block"}><strong>Price: </strong>{props.rental.price.toFixed(2) + "€"}</span>
        </Col>
        <Col sm={1}>
            <Button variant={"outline-danger"}
                    disabled={moment(props.rental.datein).isSameOrBefore(moment(), "day")}><RiDeleteBinLine/></Button>
        </Col>
    </Row></ListGroup.Item>;
}


function Sidebar(props) {

    return <Nav className={"flex-column"} variant="pills">
        <Nav.Item>
            <Nav.Link as={NavLink} to={"/user/rentals/future"}>
                Future rentals
            </Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link as={NavLink} to={"/user/rentals/past"}>
                Past rentals
            </Nav.Link>
        </Nav.Item>
    </Nav>
}

export default Rentals;