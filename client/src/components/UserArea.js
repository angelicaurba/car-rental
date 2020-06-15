import React, {useState} from 'react';
import {Col, Container, Form, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";
import {Route, Switch} from 'react-router-dom';


class UserArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                category: "",
                datain: "",
                dataout: "",
                extradrivers: "",
                driverage: "",
                kms: "",
                extrainsurance: 0
            }
        }
    }

    changeFormData = (name, value) => {
        this.setState((state) => {
            let tmp = {...state.formData};
            tmp[name] = value;
            return {formData: tmp};
        });
    }

    render() {
        return <Switch>
            <Route exact path={"/user/newrental"} render={() => <RentalForm formData={this.state.formData}/>}/>
            <Route exact path={"/user/rentals"} render={() => <Rentals/>}/>
        </Switch>
    }

}


function RentalForm(props) {
    const [submitted, setSubmitted] = useState(false);
    return <Container className={"rentalForm jumbotron"}>
        <h3 className={"formTitle"}>Rent your car now!</h3>
        <Form className={"text-left"}>
            <Row>
                <Col sm={6}>
                    <FormGroup as={Row}>
                        <FormLabel column sm={3}>From:</FormLabel>
                        <Col sm={9}>
                            <FormControl type={"date"} required readOnly={submitted} value={props.formData.datain}/>
                        </Col>
                    </FormGroup>
                </Col>
                <Col sm={6}>
                    <FormGroup as={Row}>
                        <FormLabel column sm={3}>To:</FormLabel>
                        <Col sm={9}>
                            <FormControl type={"date"} required readOnly={submitted} value={props.formData.dataout}/>
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col sm={5}>
                    <FormGroup>
                        <FormLabel>Select the category</FormLabel>
                        <Form.Control as="select" defaultValue={props.formData.category}>
                            <option>A</option>
                            <option>B</option>
                            <option>C</option>
                            <option>D</option>
                            <option>E</option>
                        </Form.Control>
                    </FormGroup>
                </Col>
                <Col sm={4}>
                    <FormGroup>
                        <FormLabel>Kilometers:</FormLabel>
                        <Form.Control as="select" disabled={props.formData.kms === -1} defaultValue={props.formData.kms}>
                            <option>{"< 50 km/day"}</option>
                            <option>{"50-150 km/day"}</option>
                            <option>{"> 150 km/day"}</option>
                        </Form.Control>
                    </FormGroup>
                </Col>
                <Col sm={3}>
                    <Form.Check  label="Unlimited" type={'checkbox'} defaultChecked = {props.formData.kms === -1} onChange={(event) => {}}/>
                </Col>
            </Row>
        </Form>
    </Container>;
}

function Rentals(props) {
    return <></>;
}

export default UserArea