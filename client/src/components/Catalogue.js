import React, { useState} from 'react';
import {Row, Col, Image} from "react-bootstrap";


function Catalogue(props){
    const [cats, setCats] = useState(["A", "B"]);
    const [brands, setBrands] = useState([]);

    return <Row>
        <Col md={3}>

        </Col>
        <Col md={8}>
            <VehiclesList vehicles={props.vehicles} cats={cats} brands={brands} />
        </Col>
    </Row>;
}

function VehiclesList(props){
    return props.vehicles
        .filter(v => props.cats.indexOf(v.category) >= 0 || props.brands.indexOf(v.brand) >= 0 )
        .map(v => <VehicleRow key={v.id} vehicle={v}/>);
}

function VehicleRow(props){
    return <Row>
    <Col sm={4}>
        <Image className={"img-fluid"} src="img/prova.png" rounded />
    </Col>
    <Col sm={4}>
        A partire da {props.vehicle.price}
    </Col>
    <Col sm={4}>
        Category: {props.vehicle.category}
        {props.vehicle.brand} {props.vehicle.model}
    </Col>
        </Row>;
}

export default Catalogue;