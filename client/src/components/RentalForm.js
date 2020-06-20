import React, {useEffect, useState} from "react";
import moment from "moment";
import {Alert, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Spinner} from "react-bootstrap";


function RentalForm(props) {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        let din = moment(props.formData.datein);
        let dout = moment(props.formData.dateout);
        if (din && dout) {
            if (din.isSameOrBefore(moment())) {
                setErrorMessage("Invalid starting date, you can rent a car starting from tomorrow!");
                setErr(true);
            } else if (din.isAfter(dout)) {
                setErrorMessage("Invalid dates, may be you swapped them?");
                setErr(true);
            } else {
                setErrorMessage("");
                setErr(false);
                let request = props.checkValues(props.formData.datein, props.formData.dateout, props.formData.category, props.formData.driverage, props.formData.extradrivers, props.formData.kms, props.formData.extrainsurance);
                if (request) {
                    setLoading(true);
                    props.retrieveNumberAndPrice(request);
                    setLoading(false);
                }
            }
        }
    }, [props.formData]);

    return <>
        <h3 className={"formTitle"}>Rent your car now!</h3>
        <Form className={"text-left"}>
            <Row>
                <Col md={6}>
                    <FormGroup as={Row}>
                        <FormLabel column sm={3}>From:</FormLabel>
                        <Col sm={9}>
                            <FormControl type={"date"} required readOnly={props.submitted}
                                         defaultValue={props.formData.datein} name={"datein"} onChange={(event) => {
                                props.changeFormData(event.target.name, event.target.value)
                            }}/>
                        </Col>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup as={Row}>
                        <FormLabel column sm={3}>To:</FormLabel>
                        <Col sm={9}>
                            <FormControl type={"date"} required readOnly={props.submitted}
                                         defaultValue={props.formData.dateout} name={"dateout"} onChange={(event) => {
                                props.changeFormData(event.target.name, event.target.value)
                            }}/>
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <FormGroup as={Row}>
                        <FormLabel column sm={3} md={6}>Car's category</FormLabel>
                        <Col sm={6}>
                            <Form.Control as="select" readOnly={props.submitted} defaultValue={props.formData.category}
                                          name={"category"} onChange={(event) => {
                                props.changeFormData(event.target.name, event.target.value)
                            }}>
                                <option></option>
                                <option>A</option>
                                <option>B</option>
                                <option>C</option>
                                <option>D</option>
                                <option>E</option>
                            </Form.Control>
                        </Col>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup as={Row}>
                        <FormLabel column sm={3} md={6}>Kilometers</FormLabel>
                        <Col sm={6}>
                            <Form.Control type={"number"} readOnly={props.submitted} as="select"
                                          defaultValue={props.formData.kms} name={"kms"} onChange={(event) => {
                                props.changeFormData(event.target.name, event.target.value)
                            }}>
                                <option value={-1}></option>
                                <option value={1}>{"0 - 49 km/day"}</option>
                                <option value={2}>{"50 - 149 km/day"}</option>
                                <option value={3}>{"Unlimited"}</option>
                            </Form.Control>
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <FormGroup as={Row}>
                        <FormLabel column sm={3} md={6}>Driver's age</FormLabel>
                        <Col sm={6}>
                            <Form.Control type={"number"} as="select" readOnly={props.submitted}
                                          defaultValue={props.formData.driverage} name={"driverage"}
                                          onChange={(event) => {
                                              props.changeFormData(event.target.name, event.target.value)
                                          }}>
                                <option value={-1}></option>
                                <option value={1}>{"18 - 24"}</option>
                                <option value={2}>{"25 - 64"}</option>
                                <option value={3}>{"65 - "}</option>
                            </Form.Control>
                        </Col>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup as={Row}>
                        <FormLabel column sm={3} md={6}>Extra drivers</FormLabel>
                        <Col sm={6}>
                            <Form.Control type={"number"} readOnly={props.submitted} min={0}
                                          defaultValue={props.formData.extradrivers} name={"extradrivers"}
                                          onChange={(event) => {
                                              props.changeFormData(event.target.name, event.target.value);
                                          }}/>
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
            <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="defaultChecked2" disabled={props.submitted}
                       checked={props.formData.extrainsurance === true} onChange={(event) => {
                    props.changeFormData("extrainsurance", event.target.checked)
                }}/>
                <label className="custom-control-label" htmlFor="defaultChecked2">I want to add an extra
                    insurance</label>
            </div>
        </Form>
        <Container id="underRentalForm">
            {
                err ?
                    <Alert variant={"danger"}>
                        {errorMessage}
                    </Alert>
                    :
                    loading ?
                        <Spinner animation="border" role="status" variant="secondary">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        :
                        null
            }
        </Container>
    </>;
}


export default RentalForm;