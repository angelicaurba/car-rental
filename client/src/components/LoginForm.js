import React from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';


function LoginForm() {
    return <Container id="loginContainer" className={"jumbotron"}>
        <Form>
            <Form.Group><h5>Write your credentials</h5></Form.Group>
            <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={2}>
                    Username
                </Form.Label>
                <Col sm={10}>
                    <Form.Control type="username" placeholder="Username"/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalPassword">
                <Form.Label column sm={2}>
                    Password
                </Form.Label>
                <Col sm={10}>
                    <Form.Control type="password" placeholder="Password"/>
                </Col>
            </Form.Group>
            <Button variant="primary" type="submit" block>
                Login
            </Button>
        </Form>
    </Container>
}

export default LoginForm;