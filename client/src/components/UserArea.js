import React from 'react';
import {Container} from "react-bootstrap";
import {Redirect, Route, Switch} from 'react-router-dom';
import RentalForm from './RentalForm';
import Payment from './Payment';
import Rentals from './Rentals.js'
import NumberAndPrice from "./NumberAndPrice.js";
import moment from 'moment';
import NumberAndPriceRequest from "../api/NumberAndPriceRequest";
import * as api from '../api/API';

const emptyFormData = {
    category: "-1",
    datein: "",
    dateout: "",
    extradrivers: 0,
    driverage: -1,
    kms: -1,
    extrainsurance: false
};
const emptyNumberAndPrice = {
    arrived: false,  //flag that is set to true when the api that retrieves number and prive returns
    isValid: false,  //to check if the received numberAndPrice object is valid
    number: -1,
    price: -1
};

class UserArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: emptyFormData,
            numberAndPrice: emptyNumberAndPrice,
            submittedForm: false,
            loadingForm: false,
            error: {
                isPresent: false,
                message: ""
            },
            paymentSubmitted: false,
            paymentSuccess: false
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

    /*
    called form the Payment when a rental booking has finished successfully;
    when not successful, data are not reset to allow the user to modify them
     */
    resetState = () => {
        this.setState({
            formData: emptyFormData,
            numberAndPrice: emptyNumberAndPrice,
            submittedForm: false,
            loadingForm: false,
            error: {
                isPresent: false,
                message: ""
            },
            paymentSubmitted: false,
            paymentSuccess: false
        });
    }

    checkValues = (datein, dateout, category, age, others, kms, insurance) => {
        if (datein && dateout && moment(datein).isAfter(moment()) && moment(datein).isSameOrBefore(dateout)) { //dates ok
            let regexCat = new RegExp("[A-E]");
            if (regexCat.test(category) && +kms !== -1 && +age !== -1 && +others >= 0) { //category, kms and age ok
                return new NumberAndPriceRequest(datein, dateout, category, +age, +others, +kms, insurance ? 1 : 0);
            }
        }
        this.setState({
            numberAndPrice: emptyNumberAndPrice
        });
        return false;
    }

    handlePayment = (paymentData) => {
        let paymentParam = {...paymentData};
        paymentParam.price = this.state.numberAndPrice.price;
        this.setState({paymentSubmitted: false});
        const formData = this.state.formData;
        let data = new NumberAndPriceRequest(formData.datein, formData.dateout, formData.category, +formData.driverage, +formData.extradrivers, +formData.kms, formData.extrainsurance ? 1 : 0);
        api.handlePayment(paymentParam, data)
            .then((result) => {
                this.setState({paymentSubmitted: true, paymentSuccess: true});
            })
            .catch(err => {
                if (err.status === 401)
                    this.props.setLoggedout();
                else
                    this.setState({paymentSubmitted: true, paymentSuccess: false});
            });
    }

    retrieveNumberAndPrice = (request) => {
        this.setState({
            numberAndPrice: emptyNumberAndPrice
        });
        return api.retrieveNumberAndPrice(request)
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
            .catch((err) => {
                if (err.status === 401)
                    this.props.setLoggedout();
                else
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
                   render={() => <Container className={"rentalForm jumbotron"}>
                       {!this.state.paymentSuccess ?
                           <><RentalForm
                               submitted={this.state.submittedForm}
                               checkValues={this.checkValues}
                               changeFormData={this.changeFormData} retrieveNumberAndPrice={this.retrieveNumberAndPrice}
                               formData={this.state.formData}/>
                               <NumberAndPrice numberAndPrice={this.state.numberAndPrice}
                                               submittedForm={this.state.submittedForm}
                                               submitRentalForm={this.submitForm}/>
                           </>
                           :
                           null
                       }
                       {this.state.submittedForm ?
                           <Payment submitRentalForm={this.submitForm}
                                    handlePayment={this.handlePayment}
                                    submitted={this.state.paymentSubmitted}
                                    success={this.state.paymentSuccess}
                                    resetState={this.resetState}/>
                           :
                           null}
                   </Container>}/>
            <Route path={"/user/rentals/"} render={() => <Rentals setLoggedout={this.props.setLoggedout}/>}/>
            <Route path={"/user/"} render={() => <Redirect to={"/catalogue"}/>}/>
        </Switch>
    }

}

export default UserArea