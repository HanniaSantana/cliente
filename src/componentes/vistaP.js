//Componente vista de la pelicula

import React, { Component } from "react";
import axios from "axios";

import Card from "react-bootstrap/Card"; //Empieza importacion de la libreria boostrap

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { Trash } from "react-bootstrap-icons";
import { Brush } from "react-bootstrap-icons";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

const estilos = {
  card: {
    marginBottom: "20px",
    marginTop: "20px",
  },
};

export default class vistaP extends Component {
  constructor() {
    //construstor de componente
    super();
    this.state = {
      mensaje: "",
      display: "",
      nombre: "",
      director: "",
      categoria: "",
      duracion: "",
      protagonistas: [""],
    };
    this.handleBorrar = this.handleBorrar.bind(this);
    this.infoEditar = this.infoEditar.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    //funcion para cambiar el valor por el que se introduzca
    this.setState({
      [event.target.name]: event.target.value,
    });

    console.log(event.target.value);
    console.log(this.state);
  };

  handleBorrar = () => {
    //funcion para borrar
    axios
      .post(`/borrarPeli/${this.props.informacion.peliculaId}`) //llamada a base de datos, request borrar + id de pelicula
      .then((res) => {
        this.setState({ mensaje: res.data, load: false, display: "none" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  infoEditar = (peliculaId) => {
    const post = {
      abrirF: false,
      nombre: this.state.nombre,
      director: this.state.director,
      categoria: this.state.categoria,
      duracion: this.state.duracion,
      protagonistas: this.state.protagonistas,
      peliculaId: peliculaId,
    };
    this.props.handleEditar(peliculaId, post);
    this.setState({abrirF:false})
  };

  render() {
    //configuracion de vista, se llena la vista con la informacion obtenida de la constante informacion
    return (
      <Col xs={12} sm={6} md={4} style={{ display: this.state.display }}>
        <Card style={estilos.card}>
          <Card.Header>
            <Row>
              <Col xs={9}>{this.props.informacion.nombre}</Col>
              <Col xs={1}>
                {" "}
                <Trash
                  style={{ color: "#e5acb6" }}
                  onClick={() => this.handleBorrar()}
                />{" "}
              </Col>
              <Col xs={1}>
                {" "}
                <Brush
                  style={{ color: "#e5acb6" }}
                  onClick={() => this.setState({ abrirF: !this.state.abrirF })}
                />{" "}
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            Director: {this.props.informacion.director}
            <br />
            Categoria: {this.props.informacion.categoria}
            <br />
            Duración: {this.props.informacion.duracion}
            <br />
            Protagonistas: {this.props.informacion.protagonistas}
          </Card.Body>
        </Card>

        {this.state.abrirF ? (
          <Alert variant="secondary" style={{position:"fixed", top: "10px", left: "10px", width: "98%", height: "96%", zIndex: 3000}}>
          <Form>
            <Form.Group>
              <Form.Label>Titulo de la Pelicula</Form.Label>
              <Form.Control
                type="text"
                placeholder="introduce el nombre"
                name="nombre"
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                placeholder="introduce el director"
                name="director"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                as="select"
                custom
                name="categoria"
                onChange={this.handleChange}
              >
                <option>Terror</option>
                <option>Amor</option>
                <option>Accion</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Duracion de la Pelicula</Form.Label>
              <Form.Control
                type="text"
                placeholder="introduce la duracion"
                name="duracion"
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Protagonista de la pelicula</Form.Label>
              <Form.Control
                type="text"
                placeholder="introduce el protagonista"
                name="protagonistas"
                onChange={this.handleChange}
              />
            </Form.Group>


            <Button
              style={{
                backgroundColor: "#D8C2C6",
                float: "right",
                color: "white",

                borderWidth: "0px"
              }}
              onClick={() => this.setState({abrirF:false})}
            >
              Cancelar
            </Button>

            <Button
              style={{
                backgroundColor: "#ffc0cb",
                float: "right",
                color: "white",
                marginRight: "20px",
                borderWidth: "0px"
              }}
              onClick={() => this.infoEditar(this.props.informacion.peliculaId)}
            >
              Enviar
            </Button>

          </Form></Alert>
        ) : (
          <div></div>
        )}
      </Col>
    );
  }
}
