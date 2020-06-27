import React from 'react';
import {Alert, Button, Form, FormControl, FormGroup, FormLabel, Spinner} from "react-bootstrap";
import moment from "moment";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import {Link} from 'react-router-dom';


class Payment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentData: {
                cvv: "",
                number: "",
                month: "",
                year: "",
                name: ""
            },
            focused: "",
            loading: false,
        }
    }

    changeState = (name, value) => {
        this.setState((state) => {
            let tmp = {...state.paymentData};
            tmp[name] = value;
            return {paymentData: tmp};
        });
    }

    changeFocus = (name) => {
        this.setState({focused: name});
    }

    isValidData = () => {
        const pattern = new RegExp("[0-9]+");
        if (pattern.test(this.state.paymentData.number) && this.state.paymentData.number.length === 16) //valid card number
            if (pattern.test(this.state.paymentData.cvv) && this.state.paymentData.cvv.length === 3) //valid cvv
                if (pattern.test(this.state.paymentData.month) && +this.state.paymentData.month >= 1 && +this.state.paymentData.month <= 12) //valid month
                    if (pattern.test(this.state.paymentData.year) && +this.state.paymentData.year >= (moment().year() - 2000)) //valid year
                        if (pattern.test(this.state.paymentData.cvv) && this.state.paymentData.cvv.length === 3) //valid year
                            return true;
        return false;
    }

    submitPayment = (form) => {
        if (form.checkValidity() && this.isValidData()) {
            this.setState({loading: true});
            this.props.handlePayment(this.state.paymentData);
            this.setState({loading: false});
        }
        form.reportValidity();
    }

    render() {
        return (this.props.submitted && this.props.success) ?
            <Alert variant={"success"}>
                <Alert.Heading>Booking executed successfully!</Alert.Heading>
                <hr/>
                <Link to={"/user/rentals/future"}><Button variant={"primary"}>Check your rentals</Button> </Link>
            </Alert>
            :
            <Row>
                <Col md={6}>
                    <Cards
                        acceptedCards={['visa', 'mastercard']}
                        cvc={this.state.paymentData.cvv}
                        expiry={(this.state.paymentData.month && this.state.paymentData.month <= 9 ? "0" : "") + this.state.paymentData.month + "/" + this.state.paymentData.year}
                        focused={this.state.focused}
                        name={this.state.paymentData.name}
                        number={this.state.paymentData.number}
                    />
                </Col>
                <Col sm={12} md={6} className={"mt-2"}>
                    <Form className={"text-left"} onSubmit={(event) => {
                        event.preventDefault();
                        this.submitPayment(event.target);
                    }}>
                        <FormGroup as={Row}>
                            <Form.Label column sm={3}>Name</Form.Label>
                            <Col sm={8}>
                                <Form.Control type={"text"} placeholder={"Name"} name={"name"}
                                              disabled={this.props.submitted && this.props.success}
                                              value={this.state.paymentData.name}
                                              pattern={"[a-zA-Z ]*"}
                                              onChange={(event) => this.changeState(event.target.name, event.target.value)}
                                              onFocus={(event) => this.changeFocus(event.target.name)}
                                              minLength={5}
                                              required/>
                            </Col>
                        </FormGroup>
                        <FormGroup as={Row}>
                            <FormLabel column sm={3}>Number</FormLabel>
                            <Col sm={8}>
                                <FormControl type={"tel"} placeholder={"Card Number"} name={"number"}
                                             disabled={this.props.submitted && this.props.success}
                                             pattern={"[0-9]{16}"}
                                             value={this.state.paymentData.number}
                                             onChange={(event) => this.changeState(event.target.name, event.target.value.toUpperCase())}
                                             onFocus={(event) => this.changeFocus(event.target.name)}
                                             required/>
                            </Col>
                        </FormGroup>
                        <FormGroup as={Row}>
                            <FormLabel column sm={3}>Expiration Date</FormLabel>
                            <Col sm={4}>
                                <FormControl type={"number"} min={1} max={12} name={"month"}
                                             disabled={this.props.submitted && this.props.success}
                                             value={this.state.paymentData.month} placeholder={"MM"}
                                             onChange={(event) => this.changeState(event.target.name, event.target.value)}
                                             onFocus={(event) => this.changeFocus("expiry")}
                                             required/>
                            </Col>
                            <Col sm={4}>
                                <FormControl type={"number"} min={20} name={"year"}
                                             disabled={this.props.submitted && this.props.success}
                                             value={this.state.paymentData.year} placeholder={"YY"}
                                             onChange={(event) => this.changeState(event.target.name, event.target.value)}
                                             onFocus={(event) => this.changeFocus("expiry")}
                                             required/>
                            </Col>
                        </FormGroup>
                        <FormGroup as={Row}>
                            <FormLabel column sm={3}>CVV</FormLabel>
                            <Col sm={4}>
                                <FormControl type={"text"} name={"cvv"}
                                             disabled={this.props.submitted && this.props.success}
                                             value={this.state.paymentData.cvv}
                                             pattern={"[0-9]{3}"}
                                             placeholder={"CVV"}
                                             onChange={(event) => this.changeState(event.target.name, event.target.value)}
                                             onFocus={(event) => this.changeFocus("cvc")}
                                             required/>
                            </Col>
                        </FormGroup>
                        {!this.props.submitted || !this.props.success ?
                            <FormGroup as={Row} className={"text-right"}>
                                <Col sm={{offset: 0}}>
                                    <Button variant={"secondary"}
                                            onClick={() => this.props.submitRentalForm(false)}>Cancel</Button>{' '}
                                    <Button variant={"success"} type={"submit"}>Confirm</Button>
                                </Col>
                            </FormGroup>
                            :
                            null}
                        {this.state.loading ?
                            <Spinner animation="border" role="status" variant="secondary"/>
                            :
                            (this.props.submitted && !this.props.success) ?
                            <Alert variant={"danger"}>
                                <Alert.Heading>Something wrong in payment! Check your data or try again
                                    later!</Alert.Heading>
                            </Alert>
                            :
                             null}
                    </Form>
                </Col>
            </Row>
    }
}

export default Payment