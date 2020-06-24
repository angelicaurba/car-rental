import React, {useEffect, useState} from 'react';
import {Alert, Button, Col, Container, Form, Row, Spinner} from 'react-bootstrap';
import * as API from "../api/API";


function LoginForm(props) {
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const errorMessage = "Your credentials are not correct!"

    return <Container id="loginContainer" className={"jumbotron"}>
        <Form onSubmit={(event) => {
            event.preventDefault();
            if (event.target.checkValidity()) {
                setLoading(true);
                (props.login(props.username, props.password))
                    .then((response) => {
                        if (!response) {
                            setLoading(false);
                            setErr(true);
                        }
                    })
                    .catch(() => {
                        setLoading(false);
                        setErr(true);
                    });
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
        <Container id="underLogin">
            {(loading === true) ?
                <Spinner animation="border" role="status" variant="secondary" />
                :
                (err === true) ?
                    <Alert variant={"danger"}>
                        {errorMessage}
                    </Alert>
                    :
                    null}
        </Container>
    </Container>
}

export default LoginForm;