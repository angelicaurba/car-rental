import {Alert, Button} from "react-bootstrap";
import React from "react";

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
                    <Alert.Heading>{"There are only "}
                        <strong>{props.numberAndPrice.number}</strong>{" cars available for the choosen period and category! " +
                        "Book yours now for "}<strong>{props.numberAndPrice.price.toFixed(2)}</strong>{"€!"}</Alert.Heading>
                    :
                    <Alert.Heading><strong>Last</strong>{" car available for the choosen period and category! " +
                    "Book it now for "}<strong>{props.numberAndPrice.price.toFixed(2)}</strong>{"€!"}</Alert.Heading>
            }
                <hr/>
                <Button variant={"primary"} disabled={props.submittedForm} className={"d-flex justify-content-end"}
                        onClick={() => props.submitRentalForm(true)}>Book your car!</Button>
            </Alert>
            </>
    }
}

export default NumberAndPrice;