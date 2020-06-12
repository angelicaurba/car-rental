import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Form, Row, Alert} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import * as API from "../api/API";


function LoginForm(props) {
    const [submitted, setSubmitted] = useState(false);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const errorMessage = "Your credentials may be uncorrect!"
    useEffect(() => {
        API.tryLogin()
            .then((response) => {
                if(response.name){
                    props.change("name", response.name);
                    props.setLogin();
                }
            })
            .catch(() => {});
        //the catch is void since no action must be done if the user was not already authenticated
    }, []);


    return submitted ? <Redirect to={"/user/newrental"}/> :
    <Container id="loginContainer" className={"jumbotron"}>
        <Form onSubmit={(event) => {
            console.log("The form is valid?");
            console.log("loginForm username + password "+ props.username + " + " + props.password);
            event.preventDefault();
            if (event.target.checkValidity()) {
                console.log("The form is valid!");
                if(props.login(props.username, props.password))
                    setSubmitted(true);
                else
                    setErr(true);
            } else
                event.target.reportValidity();
        }}>

                <Form.Group><h5>Write your credentials</h5></Form.Group>
                <Form.Group as={Row} controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                        Username
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control name="username"
                                      onChange={(event) => props.change(event.target.name, event.target.value)}
                                      type="username" placeholder="Username" value={props.username} required/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalPassword">
                    <Form.Label column sm={2}>
                        Password
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control name="password"
                                      onChange={(event) => props.change(event.target.name, event.target.value)}
                                      type="password" placeholder="Password" value={props.password} required/>
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit" block>
                    Login
                </Button>
            </Form>
            {(loading === true)?
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
                :
                (err === true) ?
                <Alert variant={"danger"}>
                    {errorMessage}
                </Alert>
                :
                null}
        </Container>
}

export default LoginForm;