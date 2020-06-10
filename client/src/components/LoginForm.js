import React, {useState} from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';


function LoginForm(props) {
    const [submitted, setSubmitted] = useState(false);

    return <Container id="loginContainer" className={"jumbotron"}>
        <Form>
            <Form.Group><h5>Write your credentials</h5></Form.Group>
            <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={2}>
                    Username
                </Form.Label>
                <Col sm={10}>
                    <Form.Control name="username" onChange={(event) => props.change(event.target.name, event.target.value)} type="username" placeholder="Username" value = {props.username} required/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalPassword">
                <Form.Label column sm={2}>
                    Password
                </Form.Label>
                <Col sm={10}>
                    <Form.Control name="password"  onChange={(event) => props.change(event.target.name, event.target.value)} type="password" placeholder="Password" value = {props.password} required/>
                </Col>
            </Form.Group>
            <Button variant="primary" type="submit" block>
                Login
            </Button>
        </Form>
    </Container>
}

export default LoginForm;