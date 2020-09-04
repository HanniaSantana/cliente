import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import VistaP from "./componentes/vistaP";

import axios from "axios";
axios.defaults.baseURL =
  "https://us-central1-catalogo-pelicu.cloudfunctions.net/api";

const estilo = {
  titulo: {
    fontSize: "31px",
    width: "100%",
    height: "50px",
    backgroundColor: "#ffc0cb",
  },
};

const margen = {
  m: {
    marginTop: "5px",
  },
};

const fondo = {
  blanco: { 
    backgroundImage: "url(" + "https://fondosmil.com/fondo/17538.jpg" + ")",
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }};


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      movies: [], //arreglo de peliculas
      buscar: "", //variable para filtar
      nombre: "",
      director: "",
      categoria: "Terror",
      duracion: "",
      protagonistas: "",
    };
    this.handleLoad = this.handleLoad.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpLoad = this.handleUpLoad.bind(this);
    this.handleEditar = this.handleEditar.bind(this);
  }

  handleEditar = (peliculaId, post) => {
    axios
      .post(`/editarpeli/${peliculaId}`, post)
      .then((res) => {
        this.setState( prevState => {
          const cambioMovies = prevState.movies.map(movie => {
            if(movie.peliculaId === peliculaId) {
              movie = post
            }
            return movie
          })
          return {
            movies: cambioMovies
          }
        })
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  
  
  handleChange = (event) => {
    //funcion para cambiar el valor por el que se introduzca
    this.setState({
      [event.target.name]: event.target.value,
    });

    console.log(event.target.value);
    console.log(this.state);
  };

  handleLoad = () => {
    //cargar todas las peliculas
    axios
      .get("/getPeliculas") //llamada a la base de datos
      .then((res) => {
        this.setState({ movies: res.data, load: false }); //se llena arreglo con la info de la BD
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleUpLoad = () => {
    let arr = [this.state.protagonistas];
    const agrega = {
      //constante para agregar la info de nueva pelicula
      nombre: this.state.nombre,
      director: this.state.director,
      categoria: this.state.categoria,
      duracion: this.state.duracion,
      protagonistas: arr,
    };
    axios
      .post("/agregaPeliculas", agrega) //llamada a base de datos y nueva info
      .then((res) => {
        console.log(res.data);
        let joined = this.state.movies.concat(res.data); //se coloca al final de las peliculas
        this.setState({
          movies: joined,
        });
      })
      .catch((err) => {
        console.log(err);
        console.log("f");
      });
  };

  componentDidMount() {
    this.handleLoad();
  }

  render() {
    let BDpeliculas = this.state.movies ? (
      this.state.movies.map((post) => (
        <VistaP informacion={post} key={post.peliculaId} handleEditar={this.handleEditar}/>
      ))
    ) : (
      <p>Loading</p>
    );

    //buscador .filter todas la info del arreglo movies con la const buscar ingresada por el usuario
    let filtro = this.state.movies
      .filter(
        (movie) =>
          movie.nombre
            .toLowerCase()
            .includes(this.state.buscar.toLowerCase()) ||
          movie.director
            .toLowerCase()
            .includes(this.state.buscar.toLowerCase()) ||
          movie.categoria
            .toLowerCase()
            .includes(this.state.buscar.toLowerCase())
      )
      .map((post) => <VistaP informacion={post} key={post.peliculaId} handleEditar={this.handleEditar} />);

    return (
      //formulario, vista de peliculas
      <div style={{  
        backgroundImage: "url(" + "https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX26661547.jpg" + ")",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}>
        <Container>
          <Row>
            <Col xs={9} style={estilo.titulo}>
              <div><strong>Catalago Peliculas - Hannia </strong></div>
            </Col>
            <Col xs={3} style={estilo.titulo}>
              <div>
                <Form.Group controlId="searchId" style={margen.m}>
                  <Form.Control
                    type="text"
                    placeholder="Busca tu pelicula"
                    name="buscar"
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} style={fondo.blanco}>
              <div></div>
              <div >

                {this.state.buscar === "" ? (
                  <Row>{BDpeliculas}</Row>
                ) : (
                  <Row>{filtro}</Row>
                )}

              </div>
            </Col>
          </Row>
        </Container>
        <Container style={fondo.blanco}>
        <Row> 
          <Col xs={4} >
          <Row>
            <Col xs={12} style={{backgroundColor:" pink"}}>

            <div style={{fontSize:"25px", marginBottom:"5px", marginTop:"5px"}}><header><strong>Agregar Pelicula</strong></header></div>
            
            </Col>
          </Row>
          <br/><br/><br/>
          <p style={{fontSize:"17px"}}>Bienvenido a nuestro catalogo de peliculas, Crees que 
            faltan peliculas? Agregalas a la derecha solamente tienes que llenar
            la informacion requerida y listo! disfruta</p> 
          <br/>
          <br/> 
          </Col> 
          <Col xs={8}> 
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
                    variant="#660066"
                    style={{ backgroundColor:"#ffc0cb", float: "right", color: "white" }}
                    onClick={() => this.handleUpLoad()}>
                    Agregar
                  </Button>
                </Form>
          </Col>
        </Row>
        </Container>
      </div>
    );
  }
}
