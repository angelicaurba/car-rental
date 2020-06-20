import React from 'react';
import PaymentCard from 'react-payment-card-component'
import {Alert, Button, Form, FormControl, FormGroup, FormLabel, Spinner} from "react-bootstrap";
import moment from "moment";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";


class Payment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentData: {
                cvv: "",
                number: "",
                month: "",
                year: "",
                name: "",
                flipped: false
            },
            loading: false,
            submitted: false
        }
    }

    changeState = (name, value) => {
        this.setState((state) => {
            let tmp = {...state.paymentData};
            tmp[name] = value;
            return {paymentData: tmp};
        });
    }

    isValidData = () => {
        const pattern = new RegExp("[0-9]+");
        if (pattern.test(this.state.paymentData.number) && this.state.paymentData.number.length === 16) //valid card number
            if (pattern.test(this.state.paymentData.cvv) && this.state.paymentData.cvv.length === 3) //valid cvv
                if (pattern.test(this.state.paymentData.month) && +this.state.paymentData.month >= 1 && +this.state.paymentData.month <= 12) //valid month
                    if (pattern.test(this.state.paymentData.year) && +this.state.paymentData.year >= (moment().year() - 2000)) //valid year
                        return true;
        return false;
    }

    submitPayment = (form) => {
        if (form.checkValidity() && this.isValidData()) {
            //this.setState({loading: true});
            //api call
            //if not ok
            //this.setState({loading: false});
            //and some error message
            //else
            //this.setState({submitted: true});
            //show a message for successful payment
        }
        form.reportValidity();
    }

    render() {
        if(this.state.submitted)
            return <Alert variant={"success"}>
                <Alert.Heading>Payment executed successfully!</Alert.Heading>
            </Alert>
        else
        return <Container className={"jumbotron"}>
            <Row>
                <Col md={5}>
                    <PaymentCard
                        bank="itau"
                        model="personnalite"
                        type="black"
                        brand="mastercard"
                        number={this.state.paymentData.number}
                        cvv={this.state.paymentData.cvv}
                        holderName={this.state.paymentData.name}
                        expiration={this.state.paymentData.month + "/" + this.state.paymentData.year}
                        flipped={this.state.formData.flipped}
                    />
                </Col>
                <Col md={6}>
                    <Form onSubmit={(event) => {event.preventDefault(); this.submitPayment(event.target);}}>
                        <FormGroup>
                            <FormControl type={"text"} placeholder={"Name"} name={"name"}
                                         defaultValue={this.state.paymentData.name}
                                         onChange={(event) => this.changeState(event.target.name, event.target.value)}
                                         required/>
                            <FormLabel>Name</FormLabel>
                        </FormGroup>
                        <FormGroup>
                            <FormControl type={"tel"} placeholder={"Card Number"} name={"number"}
                                         defaultValue={this.state.paymentData.number}
                                         onChange={(event) => this.changeState(event.target.name, event.target.value)}
                                         required/>
                            <FormLabel>Number</FormLabel>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Expiration Date</FormLabel>
                            <FormControl column={5} type={"number"} min={1} max={12} name={"month"}
                                         defaultValue={this.state.paymentData.month}
                                         onChange={(event) => this.changeState(event.target.name, event.target.value)}
                                         required/>
                            <FormControl column={5} type={"number"} min={20} name={"year"}
                                         defaultValue={this.state.paymentData.year}
                                         onChange={(event) => this.changeState(event.target.name, event.target.value)}
                                         required/>
                        </FormGroup>
                        <FormGroup>
                            <Button variant={"secondary"} onClick={this.props.submitRentalForm(false)}>Cancel</Button>
                            <Button variant={"success"} type={"submit"}>Confirm</Button>
                        </FormGroup>
                        {this.state.loading ?
                            <Spinner animation="border" role="status" variant="secondary"/> : null}
                    </Form>
                </Col>
            </Row>
        </Container>
    }
}

export default Payment