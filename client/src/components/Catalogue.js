import React from 'react';
import {Col, Form, Image, ListGroup, Row, Card, Button, Alert} from "react-bootstrap";
import {FaFilter} from 'react-icons/fa';
import Badge from "react-bootstrap/Badge";


class Catalogue extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cats: [],
            brands: []
        }
    }

    changeState(name, value) {
            this.setState((state) => {
                let tmp = [];
                if(state[name].indexOf(value) >= 0)
                    tmp = [...state[name]].filter(val => val !== value);
                else {
                    tmp = [...state[name]];
                    tmp.push(value);
                }
                return {[name]: tmp}
            })
    }

    render() {
        const brands = distinctBrands(this.props.vehicles);
        return <Row>
            <Col md={4} className={"jumbotron"}>
                <Form  className={"text-left"}>
                    <Form.Group>
                        <FaFilter/> <strong> Filter your results for:</strong>
                    </Form.Group>
                        <strong>Category:</strong>
                    <Row>
                        <Col xs={5} sm={5} md={6}>
                            <Form.Check label="A" type={'checkbox'} key={1} defaultChecked = {!this.state.first && this.state.cats.indexOf("A") >= 0} onChange={(event) => {this.changeState("cats", "A" );}}/>
                            <Form.Check label="B" type={'checkbox'} key={2} defaultChecked = {!this.state.first && this.state.cats.indexOf("B") >= 0} onChange={(event) => {this.changeState("cats", "B" );}}/>
                            <Form.Check label="C" type={'checkbox'} key={3} defaultChecked = {!this.state.first && this.state.cats.indexOf("C") >= 0} onChange={(event) => {this.changeState("cats", "C" );}}/>
                        </Col>
                        <Col xs={5} sm={5} md={6}>
                            <Form.Check label="D" type={'checkbox'} key={4} defaultChecked = {!this.state.first && this.state.cats.indexOf("D") >= 0} onChange={(event) => {this.changeState("cats", "D" );}}/>
                            <Form.Check label="E" type={'checkbox'} key={5} defaultChecked = {!this.state.first && this.state.cats.indexOf("E") >= 0} onChange={(event) => {this.changeState("cats", "E" );}}/>
                        </Col>
                    </Row>
                    {brands.length > 0 ?
                        <><strong>Brand:</strong>
                        <Row>
                            <Col xs={5} sm={5} md={6}>
                                {brands.filter((b, index) => index <= brands.length/2)
                                    .map((v,index) => <Form.Check label={v} type={'checkbox'} key={index} defaultChecked = {this.state.brands.indexOf(v) >= 0} onChange={(event) => {this.changeState("brands", v);}}/>)}
                            </Col>
                            <Col xs={5} sm={5} md={6}>
                                {brands.filter((b, index) => !(index <= brands.length/2))
                                    .map((v,index) => <Form.Check label={v} type={'checkbox'} key={index} defaultChecked = {this.state.brands.indexOf(v) >= 0} onChange={(event) => {this.changeState("brands", v);}}/>)}
                            </Col>
                        </Row></>
                        : null
                    }
                </Form>
            </Col>
            <Col md={8}>
                { (this.props.loading) ?
                    <Card className={"minHeight align-items-center d-flex justify-content-center"}><ListGroup>
                        <Alert variant={"secondary"} style={{width: '40vw', alignContent: "center"}}>
                            <Alert.Heading>{"Loading. . ."}</Alert.Heading>
                        </Alert></ListGroup></Card>
                    :
                    this.props.vehicles.length > 0 ?
                <Card className={"minHeight"} ><ListGroup><VehiclesList vehicles={this.props.vehicles} cats={this.state.cats} brands={this.state.brands}/></ListGroup></Card>
                :
                    <Card className={"minHeight align-items-center d-flex justify-content-center"}><ListGroup>
                        <Alert variant={"warning"} style={{width: '40vw', alignContent: "center"}}>
                            <Alert.Heading>{"Something went wrong in loading the cars, try again later or contact us at someaddress@mail.com"}</Alert.Heading>
                        </Alert></ListGroup></Card>}
                </Col>
        </Row>;
    }
}

function VehiclesList(props) {
    const vehicles = props.vehicles
        .filter(v => (props.cats.length === 0 || props.cats.indexOf(v.category) >= 0 ) && (props.brands.length === 0 || props.brands.indexOf(v.brand) >= 0));

    if(vehicles.length === 0)
        return <Card className={"minHeight align-items-center d-flex justify-content-center"}><ListGroup>
            <Alert variant={"secondary"} style={{width: '40vw', alignContent: "center"}}>
                <Alert.Heading>{"Sorry! There are no available cars for the selected filters!"}</Alert.Heading>
            </Alert></ListGroup></Card>
    return vehicles.map(v => <VehicleRow key={v.id} vehicle={v}/>);
}

function VehicleRow(props) {
    let img = "/img/" + props.vehicle.brand.toLowerCase().split(" ").join("-") + "_"
        +  props.vehicle.model.toLowerCase().split(" ").join("-") + "_" + props.vehicle.category.toLowerCase() + ".jpg";
    let variant;
    switch (props.vehicle.category) {
        case "A": variant = "danger"; break;
        case "B": variant = "warning"; break;
        case "C": variant = "success"; break;
        case "D": variant = "primary"; break;
        case "E": variant = "info"; break;
    }

    return <ListGroup.Item className={"vehicleRow"}><Row >
        <Col sm={4}>
            <Image className={"img-fluid"} src={img} rounded thumbnail/>
        </Col>
        <Col sm={5} className={"price"}>
            <small className={"d-block"}>Starting from</small>
            <span className={"d-inline"}><h1 className="display-4 d-inline">{(props.vehicle.price*(1-5/100)*(1-10/100)).toFixed(2)}€</h1><small className={"d-inline"}>/day</small></span>
        </Col>
        <Col sm={3} className={"category"}>
            <h5 className={"d-block"}>{props.vehicle.brand} {props.vehicle.model}</h5>
            <h6 className={"d-block"}><Badge variant={variant}>{"Category "+ props.vehicle.category}</Badge></h6>
        </Col>
    </Row></ListGroup.Item>;
}

function distinctBrands(vehicles) {
    let res = [];
    vehicles.map(v => v.brand).forEach(brand => {
        if (res.indexOf(brand) < 0)
            res.push(brand);
    });
    return res.sort((b1, b2) => b1 > b2 ? 1 : -1);
}

export default Catalogue;