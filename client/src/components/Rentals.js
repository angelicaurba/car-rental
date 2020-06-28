import React, {useEffect, useState} from "react";
import moment from 'moment';
import {Alert, Button, Card, Col, Container, Image, ListGroup, Modal, ModalTitle, Nav, Row} from "react-bootstrap";
import {NavLink, Redirect, Route} from 'react-router-dom';
import {RiDeleteBinLine} from "react-icons/ri";
import * as api from '../api/API'
import {AiOutlineStop} from "react-icons/ai";
import ModalHeader from "react-bootstrap/ModalHeader";

function Rentals(props) {
    const [loading, setLoading] = useState(false);
    const [rentals, setRentals] = useState([]);
    const [error, setError] = useState(false);
    const [rentalid, setRentalid] = useState(-1); //store the id of the rental to be deleted
    const [confirm, setConfirm] = useState(false); //store the confirmation of deleting the rental


    useEffect(() => {
        if (confirm && rentalid >= 0) {
            let rental = rentalid;
            setConfirm(false);
            setRentalid(-1);
            api.deleteRental(rental)
                .then(() => setRentals((rentals) => rentals.filter(r => r.rentalid !== rental) ))
                .catch((error) => {
                    if (error.status === 401) {
                        //unauthorized, the token expired
                        props.setLoggedout();
                    } else {
                        setError(true);
                    }
                });
        }
    }, [confirm]);

    useEffect(() => {
        setLoading(true);
        api.getRentals()
            .then((rentals) => {
                setRentals(rentals);
                setError(false);
                setLoading(false);
            })
            .catch((error) => {
                if (error.status === 401) {
                    //unauthorized, the token expired
                    props.setLoggedout();
                } else {
                    setError(true);
                    setLoading(false);
                }
            });
    }, [])

    const previous = rentals.filter(rental => moment(rental.dateout).isBefore(moment(), "day"))
        .sort((r1, r2) => r1.datein > r2.datein ? -1 : (r1.datein < r2.datein ? 1 : (r1.dateout < r2.dateout ? 1 : -1)));

    const future = rentals.filter(rental => moment(rental.dateout).isSameOrAfter(moment(), "day"))
        .sort((r1, r2) => -(r1.datein > r2.datein ? -1 : (r1.datein < r2.datein ? 1 : (r1.dateout < r2.dateout ? 1 : -1))));

    return <>
        <Row>
            <Col md={3}>
                <Container className={"jumbotron"}><Sidebar/></Container>
            </Col>
            <Col md={9}>
                <Route exact path={"/user/rentals/:when"} render={({match}) => {
                    return (match.params.when !== "past" && match.params.when !== "future") ?
                        <Redirect to={"/user/rentals/future"}/>
                        :
                        <>
                            <RentalList loading={loading} error={error} deleteRental={setRentalid}
                                        rentals={match.params.when === "future" ? future : previous}/>
                            <Modal show={rentalid >= 0}
                                   onHide={() => {
                                       setRentalid(-1);
                                       setConfirm(false);
                                   }}
                                   backdrop="static"
                                   keyboard={false}>
                                <ModalHeader><ModalTitle>Are you sure?</ModalTitle></ModalHeader>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => {
                                        setRentalid(-1);
                                        setConfirm(false);
                                    }}>No</Button>
                                    <Button variant="success" onClick={() => setConfirm(true)}>Yes</Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                }}>
                </Route>
            </Col>
        </Row>
    </>

}

function RentalList(props) {
    return props.loading ?
        <Card className={"minHeight align-items-center d-flex justify-content-center"}><ListGroup>
            <Alert variant={"secondary"} style={{width: '40vw', alignContent: "center"}}>
                <Alert.Heading>{"Loading . . ."}</Alert.Heading>
            </Alert></ListGroup></Card>
        :
    props.rentals.length === 0 ?
        <Card className={"minHeight align-items-center d-flex justify-content-center"}><ListGroup>
            <Alert variant={"secondary"} style={{width: '40vw', alignContent: "center"}}>
                <Alert.Heading>{"There are no rentals in this section"}</Alert.Heading>
            </Alert></ListGroup></Card>
        :
        props.error ?
            <Card className={"minHeight align-items-center d-flex justify-content-center"}><ListGroup>
                <Alert variant={"danger"} style={{width: '40vw', alignContent: "center"}}>
                    {"Oops! Something went wrong, reload the page or try again later"}
                </Alert>
            </ListGroup></Card>
            :
            <Card className={"minHeight"}><ListGroup>
                {props.rentals.map((rental, index) => <RentalRow key={index} deleteRental={props.deleteRental}
                                                                 rental={rental}/>)}
            </ListGroup></Card>
}

function RentalRow(props) {
    let img = "/img/" + props.rental.vehicle.brand.toLowerCase().split(" ").join("-") + "_"
        + props.rental.vehicle.model.toLowerCase().split(" ").join("-") + "_" + props.rental.vehicle.category.toLowerCase() + ".jpg";

    return <ListGroup.Item className={"rentalRow"}><Row className={"align-items-center d-flex justify-content-left"}>
        <Col sm={4}>
            <Image className={"img-fluid"} src={img} rounded thumbnail/>
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
        {moment(props.rental.dateout).isSameOrAfter(moment(), "day") ?
            <Col sm={1}>
                <Button variant={"outline-danger"}
                        disabled={moment(props.rental.datein).isSameOrBefore(moment(), "day")}
                        onClick={() => props.deleteRental(props.rental.rentalid)}>{
                    moment(props.rental.datein).isAfter(moment(), "day") ?
                        <RiDeleteBinLine/>
                        :
                        <AiOutlineStop/>}</Button>
            </Col>
            : null
        }
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