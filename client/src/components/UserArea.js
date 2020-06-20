import React from 'react';
import {Alert, Button, Container} from "react-bootstrap";
import {Route, Switch} from 'react-router-dom';
import RentalForm from './RentalForm';
import Payment from './Payment';
import moment from 'moment';
import NumberAndPriceRequest from "../api/NumberAndPriceRequest";
import * as api from '../api/API';


class UserArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                category: "-1",
                datein: "",
                dateout: "",
                extradrivers: 0,
                driverage: -1,
                kms: -1,
                extrainsurance: false
            }
            , numberAndPrice: {
                arrived: false,
                isValid: false,
                number: -1,
                price: -1
            },
            submittedForm: false,
            loadingForm: false,
            error: {
                isPresent: false,
                message: ""
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

    submitForm = (value) => {
        this.setState({submittedForm: value});
    }

    checkValues = (datein, dateout, category, age, others, kms, insurance) => {
        if (datein && dateout && moment(datein).isAfter(moment()) && moment(datein).isSameOrBefore(dateout)) { //dates ok
            let regexCat = new RegExp("[A-E]");
            if (regexCat.test(category) && +kms !== -1 && +age !== -1 && +others >= 0) { //category, kms and age ok
                return new NumberAndPriceRequest(datein, dateout, category, +age, +others, +kms, insurance ? 1 : 0);
            }
        }
        this.setState({
            numberAndPrice: {
                arrived: false,
                isValid: false,
                number: -1,
                price: -1
            }
        });
        return false;
    }

    retrieveNumberAndPrice = (request) => {
        this.setState({
            numberAndPrice: {
                arrived: false,
                isValid: false,
                number: -1,
                price: -1
            }
        });
        api.retrieveNumberAndPrice(request)
            .then((result) => {
                this.setState({
                    numberAndPrice: {
                        arrived: true,
                        isValid: true,
                        number: result.number,
                        price: result.price
                    }
                });
            })
            .catch((result) => {
                console.log(result);
                this.setState({
                    numberAndPrice: {
                        arrived: true,
                        isValid: false,
                        number: -1,
                        price: -1
                    }
                });
            });
    }


    render() {
        return <Switch>
            <Route exact path={"/user/newrental"}
                   render={() => <Container className={"rentalForm jumbotron"}><RentalForm
                       submitted={this.state.submittedForm}
                       checkValues={this.checkValues}
                       changeFormData={this.changeFormData} retrieveNumberAndPrice={this.retrieveNumberAndPrice}
                       formData={this.state.formData}/>
                       {this.state.submittedForm ?
                           <Payment submitRentalForm={this.submitForm}/>
                           :
                           <NumberAndPrice numberAndPrice={this.state.numberAndPrice} submitForm={this.submitForm}/>
                       }
                   </Container>}/>
            <Route exact path={"/user/rentals"} render={() => <Rentals/>}/>
        </Switch>
    }

}


function Rentals(props) {
    return <></>;
}

function NumberAndPrice(props) {
    if (!props.numberAndPrice.arrived)
        return null;
    else {
        if (!props.numberAndPrice.isValid || props.numberAndPrice.number === 0) {
            return <Alert variant={"danger"}>
                {!props.numberAndPrice.isValid ? "Oops! Something went wrong, try again later!"
                    :
                    "There are no cars available for the choosen period and category, try another rental period or change the category!"
                }
            </Alert>
        } else if (props.numberAndPrice.isValid && props.numberAndPrice.number > 0)
            return <><Alert variant={"success"}>{
                props.numberAndPrice.number > 1 ?
                    <Alert.Heading>{"There are only " +
                    <strong>props.numberAndPrice.number</strong> + "cars available for the choosen period and category! " +
                    "Book yours now for " + props.numberAndPrice.price.toFixed(2) + "€!"}</Alert.Heading>
                    :
                    <Alert.Heading><strong>Last</strong>{" car available for the choosen period and category! " +
                    "Book it now for " + props.numberAndPrice.price.toFixed(2) + "€!"}</Alert.Heading>
            }
            <hr/>
                <Button variant={"primary"} className={"d-flex justify-content-end"} onClick={() => props.submitForm(true)}>Book your car!</Button>
            </Alert>
            </>
    }
}

export default UserArea