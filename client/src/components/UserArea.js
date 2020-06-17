import React from 'react';
import {Alert, Container} from "react-bootstrap";
import {Route, Switch} from 'react-router-dom';
import RentalForm from './RentalForm';
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

    checkValues = (datein, dateout, category, age, others, kms, insurance) => {
        if (datein && dateout && moment(datein).isAfter(moment()) && moment(datein).isSameOrBefore(dateout)) { //dates ok
            let regexCat = new RegExp("[A-E]");
            if (regexCat.test(category) && +kms !== -1 && +age !== -1) { //category, kms and age ok
                return new NumberAndPriceRequest(datein, dateout, category, +age, +others, +kms, insurance ? 1 : 0);
            }
        }
        return false;
    }

    retrieveNumberAndPrice = (request) => {
        api.retrieveNumberAndPrice(request)
            .then((result) => {
                console.log(result);
                this.setState({
                numberAndPrice: {
                    isValid: true,
                    number: result.number,
                    price: result.price
                }
            });})
            .catch((result) => {
                console.log(result);
                this.setState({
                    numberAndPrice: {
                        isValid: false,
                        number: -1,
                        price: -1
                    }
                });
            });
    }

    resultArrived = (arrived) => {
        this.setState((state) => {
            let tmp = {...state.numberAndPrice};
            tmp.arrived = arrived;
            return {numberAndPrice: tmp};
        })
    }

    render() {
        return <Switch>
            <Route exact path={"/user/newrental"}
                   render={() => <Container className={"rentalForm jumbotron"}><RentalForm
                       resultArrived={this.resultArrived} checkValues={this.checkValues}
                       changeFormData={this.changeFormData} retrieveNumberAndPrice={this.retrieveNumberAndPrice}
                       formData={this.state.formData}/>
                       <NumberAndPrice numberAndPrice={this.state.numberAndPrice}/>
                   </Container>}/>
            <Route exact path={"/user/rentals"} render={() => <Rentals/>}/>
        </Switch>
    }

}


function Rentals(props) {
    return <></>;
}

function NumberAndPrice(props){
    if(!props.numberAndPrice.arrived)
        return null;
    else{
        if(!props.numberAndPrice.isValid || props.numberAndPrice.number === 0){
            return <Alert variant={"danger"}>
                {!props.numberAndPrice.isValid ? "Oops! Something went wrong, try again later!"
                    :
                    "There are no cars available for the choosen period and category, try another rental period or change the category!"
                }
            </Alert>
        }
        else if(props.numberAndPrice.isValid && props.numberAndPrice.number > 0)
            return <Alert variant={"success"}>{
                    "There are only "+props.numberAndPrice.number+" cars available for the choosen period and category! " +
                    "Book yours now for "+props.numberAndPrice.number+"!"
                }
            </Alert>
    }

}

export default UserArea