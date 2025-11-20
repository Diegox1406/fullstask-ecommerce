import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import { GeoAlt, Cart } from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function EcommerceNavbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();

  const linkMap = {
    Inicio: "/",
    Accesorios: "/accesorios",
    Promociones: "/promociones",
    Cotizaciones: "/cotizaciones",
    Ofertas: "/ofertas",
    Contacto: "/contacto",
  };

  const categories = ["Inicio","Ofertas","Promociones","Accesorios","Cotizaciones","Contacto"];
  const getPath = (category) => linkMap[category] || "#";

  return (
    <>
      <Navbar expand="lg" className="custom-navbar navbar-dark-text bg-white" fixed="top">
        <Container>
          <Link to="/" className="navbar-brand">
            <Image src="/images/logo.jpg" alt="company logo" rounded width={50} height={50} className="d-inline-block align-text-top me-2"
              onError={(e)=>{e.target.onerror=null;e.target.src="https://placehold.co/50x50/cccccc/333333?text=Logo"}}/>
            Iphone Key
          </Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Form className="d-flex mx-auto" style={{ width: "400px" }}>
              <Form.Control type="search" placeholder="Buscar productos..." className="me-2 custom-search-input" aria-label="Search"
                style={{ borderRadius: "25px", backgroundColor: "#fedf9f", border: "none", padding: "10px 20px" }} />
              <Button variant="outline-dark" className="search-btn-custom" style={{ borderRadius: "25px", padding: "10px 20px" }}>Buscar</Button>
            </Form>
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Link href="#" className="d-flex align-items-center me-3"><GeoAlt size={20} className="me-1"/><span className="d-none d-sm-inline">Ubicación</span></Nav.Link>
              <Nav.Link as={Link} to="/carrito" className="d-flex align-items-center position-relative me-3">
                <Cart size={22}/>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{cartCount}</span>
              </Nav.Link>
              {isAuthenticated ? (
                <>
                  {isAdmin && (<Link className="btn btn-sm btn-outline-secondary me-2" to="/admin" style={{ borderRadius: "25px", padding: "5px 15px" }}>🛠️ Panel Admin</Link>)}
                  <span className="text-muted me-2">Hola, {user?.name || user?.email || 'Usuario'}</span>
                  <Button variant="outline-danger" size="sm" onClick={logout} style={{ borderRadius: "25px", padding: "5px 15px" }}>Salir</Button>
                </>
              ) : (
                <>
                  <Link to="/login"><Button variant="outline-dark" size="sm" style={{ borderRadius: "25px", padding: "5px 15px" }} className="me-2">Iniciar sesión</Button></Link>
                  <Link to="/register"><Button size="sm" style={{ borderRadius: "25px", padding: "5px 15px", backgroundColor: "#fedf9f", border: "none", color: "#000" }}>Registrarse</Button></Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="second-navbar-row py-2" style={{ marginTop: "65px" }}>
        <Container>
          <div className="category-buttons-container d-flex flex-wrap justify-content-center">
            {categories.map((category,index)=>(
              <Link key={index} to={getPath(category)} className="mx-1 my-1 text-decoration-none">
                <Button variant={getPath(category)==="#"?"outline-secondary":"primary"} size="sm" className="category-button">{category}</Button>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}

export default EcommerceNavbar;
