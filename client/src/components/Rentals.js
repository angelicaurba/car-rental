import React, {useState} from "react";
import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import moment from 'moment';
import {Card, Image, ListGroup} from "react-bootstrap";
import {NavLink} from 'react-router-dom';
import Route from "react-router-dom/es/Route";
import Redirect from "react-router-dom/es/Redirect";

function Rentals(props) {
    const [rentals, setrentals] = useState([{
        datein: "2020-10-19",
        dateto: "2020-10-19",
        kms: "0 - 49 kms/day",
        vehicle: {brand: "Fiat", model: 500, category: "A"},
        price: 70.0,
        age: "18 - 24",
        others: 2,
        insurance: 1
    }]);
    //useEffect(api.getRentals,[])

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
                        <Card><ListGroup>
                            {rentals.filter(rental => (match.params.when == "future" && moment(rental.datein).isAfter(moment(), "day"))
                                || (match.params.when == "past" && moment(rental.datein).isSameOrBefore(moment(), "day")))
                                .map((rental, index) => <RentalRow key={index} rental={rental}/>)}
                        </ListGroup></Card>
                }}>
                </Route>
            </Col>
        </Row>
    </>

}

function RentalRow(props) {
    return <ListGroup.Item><Row className={"rentalRow"}>
        <Col sm={4}>
            <Image className={"img-fluid"} src="/img/prova.png" rounded thumbnail/>
        </Col>
        <Col sm={4} className={"text-left"}>
            <span className={"d-block"}><strong>From: </strong>{moment(props.rental.datein).calendar()}</span>
            <span className={"d-block"}><strong>To: </strong>{moment(props.rental.dateto).calendar()}</span>
            <span className={"d-block"}><strong>Kilometers: </strong>{props.rental.kms}</span>
            <span className={"d-block"}><strong>Category: </strong>{props.rental.vehicle.category}</span>
            <span className={"d-block"}><strong>Vehicle: </strong>{props.rental.vehicle.brand + " " + props.rental.vehicle.model}</span>
        </Col>
        <Col sm={3} className={"text-left"}>
            <span className={"d-block"}><strong>Driver's age: </strong>{props.rental.age}</span>
            <span className={"d-block"}><strong>Other drivers: </strong>{props.rental.others}</span>
            <span className={"d-block"}><strong>Extra insurance: </strong>{props.rental.insurance ? "yes" : "no"}</span>
            <span className={"d-block"}><strong>Price: </strong>{props.rental.price.toFixed(2)+"€"}</span>
        </Col>
        <Col>
            
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