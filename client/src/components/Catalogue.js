import React from 'react';
import {Col, Form, Image, ListGroup, Row, Card, Button} from "react-bootstrap";
import {FaFilter} from 'react-icons/fa';


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
        return <Row>
            <Col md={3} className={"jumbotron"}>
                <Form >
                    <Form.Group>
                        <FaFilter/> <strong> Filter your results for:</strong>
                    </Form.Group>
                    <Row>
                        <Col xs={3} sm={5}><strong>Category:</strong></Col>
                        <Col xs={3} sm={3}>
                            <Form.Check label="A" type={'checkbox'} key={1} defaultChecked = {!this.state.first && this.state.cats.indexOf("A") >= 0} onChange={(event) => {this.changeState("cats", "A" );}}/>
                            <Form.Check label="B" type={'checkbox'} key={2} defaultChecked = {!this.state.first && this.state.cats.indexOf("B") >= 0} onChange={(event) => {this.changeState("cats", "B" );}}/>
                            <Form.Check label="C" type={'checkbox'} key={3} defaultChecked = {!this.state.first && this.state.cats.indexOf("C") >= 0} onChange={(event) => {this.changeState("cats", "C" );}}/>
                        </Col>
                        <Col xs={3} sm={3}>
                            <Form.Check label="D" type={'checkbox'} key={4} defaultChecked = {!this.state.first && this.state.cats.indexOf("D") >= 0} onChange={(event) => {this.changeState("cats", "D" );}}/>
                            <Form.Check label="E" type={'checkbox'} key={5} defaultChecked = {!this.state.first && this.state.cats.indexOf("E") >= 0} onChange={(event) => {this.changeState("cats", "E" );}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3} sm={5}><strong>Brand:</strong></Col>
                        <Col xs={3} sm={3}>
                            {distinctBrands(this.props.vehicles)
                                .map((v,index) => <Form.Check label={v} type={'checkbox'} key={index} defaultChecked = {this.state.brands.indexOf(v) >= 0} onChange={(event) => {this.changeState("brands", v);}}/>)}
                        </Col>
                    </Row>
                </Form>
            </Col>
            <Col md={9}>
                <Card className={"minHeight"} ><ListGroup><VehiclesList vehicles={this.props.vehicles} cats={this.state.cats} brands={this.state.brands}/></ListGroup></Card>
            </Col>
        </Row>;
    }
}

function VehiclesList(props) {
    return props.vehicles
        .filter(v => (props.cats.length === 0 || props.cats.indexOf(v.category) >= 0 ) && (props.brands.length === 0 || props.brands.indexOf(v.brand) >= 0))
        .map(v => <VehicleRow key={v.id} vehicle={v}/>);
}

function VehicleRow(props) {
    return <ListGroup.Item><Row className={"vehicleRow"}>
        <Col sm={4}>
            <Image className={"img-fluid"} src="/img/prova.png" rounded thumbnail/>
        </Col>
        <Col sm={5} className={"price"}>
            <small className={"d-block"}>Starting from</small>
            <span className={"d-inline"}><h1 className="display-4 d-inline">{(props.vehicle.price*(1-5/100)*(1-10/100)).toFixed(2)}€</h1><small className={"d-inline"}>/day</small></span>
        </Col>
        <Col sm={3} className={"category"}>
            <h5 className={"d-block"}>{props.vehicle.brand} {props.vehicle.model}</h5>
            <h6 className={"d-block"}>Category <Button disabled variant="danger">{props.vehicle.category}</Button></h6>
        </Col>
    </Row></ListGroup.Item>;
}

function distinctBrands(vehicles) {
    let res = [];
    vehicles.map(v => v.brand).forEach(brand => {
        if (res.indexOf(brand) < 0)
            res.push(brand);
    });
    return res;
}

export default Catalogue;