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

function EcommerceNavbar() {
  const { user, logout } = useAuth();

  // Mapa de categorías y sus rutas correspondientes
  const linkMap = {
    Inicio: "/",
    Accesorios: "/accesorios",
    Promociones: "/promociones",
    Cotizaciones: "/cotizaciones",
    Ofertas: "/ofertas",
    Contacto: "/contacto",
  };

  // Categorías para los botones de la segunda fila
  const categories = [
    "Inicio",
    "Ofertas",
    "Promociones",
    "Accesorios",
    "Cotizaciones",
    "Contacto",
  ];

  // Función para obtener la ruta (si existe) o '#' si es solo un botón
  const getPath = (category) => {
    // Si la categoría tiene un mapa, devuelve su ruta. Si no, devuelve '#'
    return linkMap[category] || "#";
  };

  return (
    <>
      {/* Main Navbar */}
      <Navbar
        expand="lg"
        className="custom-navbar navbar-dark-text bg-white"
        fixed="top"
      >
        <Container>
          {/* Usamos el componente Link to="/" */}
          <Link to="/" className="navbar-brand">
            <Image
              src="/images/logo.jpg"
              alt="company logo"
              rounded
              width={50}
              height={50}
              className="d-inline-block align-text-top me-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/50x50/cccccc/333333?text=Logo";
              }}
            />
            Iphone Key
          </Link>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            {/* Formulario de búsqueda centrado */}
            <Form className="d-flex mx-auto" style={{ width: "400px" }}>
              <Form.Control
                type="search"
                placeholder="Buscar productos..."
                className="me-2 custom-search-input"
                aria-label="Search"
                style={{
                  borderRadius: "25px",
                  backgroundColor: "#fedf9f",
                  border: "none",
                  padding: "10px 20px",
                }}
              />
              <Button
                variant="outline-dark"
                className="search-btn-custom"
                style={{
                  borderRadius: "25px",
                  padding: "10px 20px",
                }}
              >
                Buscar
              </Button>
            </Form>

            {/* Iconos de utilidades a la derecha */}
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Link href="#" className="d-flex align-items-center me-3">
                <GeoAlt size={20} className="me-1" />
                <span className="d-none d-sm-inline">Ubicación</span>
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/carrito"
                className="d-flex align-items-center position-relative me-3"
              >
                <Cart size={22} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {JSON.parse(localStorage.getItem("cart") || "[]").length}
                </span>
              </Nav.Link>

              {/* Botones de Login/Register dentro del navbar */}
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link
                      className="btn btn-sm btn-outline-secondary me-2"
                      to="/admin"
                      style={{ borderRadius: "25px", padding: "5px 15px" }}
                    >
                      Panel Admin
                    </Link>
                  )}
                  <span className="text-muted me-2">Hola, {user.name}</span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={logout}
                    style={{ borderRadius: "25px", padding: "5px 15px" }}
                  >
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  {/* BOTÓN TEMPORAL*/}
                  <Link to="/admin">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      style={{ borderRadius: "25px", padding: "5px 15px" }}
                      className="me-2"
                      title="Vista previa del panel admin (temporal)"
                    >
                      👤 Admin Preview
                    </Button>
                  </Link>

                  <Link to="/login">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      style={{ borderRadius: "25px", padding: "5px 15px" }}
                      className="me-2"
                    >
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      size="sm"
                      style={{
                        borderRadius: "25px",
                        padding: "5px 15px",
                        backgroundColor: "#fedf9f",
                        border: "none",
                        color: "#000",
                      }}
                    >
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Second Row with Category Buttons */}
      <div className="second-navbar-row py-2" style={{ marginTop: "65px" }}>
        <Container>
          <div className="category-buttons-container d-flex flex-wrap justify-content-center">
            {categories.map((category, index) => {
              const path = getPath(category);
              return (
                <Link
                  key={index}
                  to={path} // La ruta de React Router
                  className="mx-1 my-1 text-decoration-none" // Clases para espaciado y quitar subrayado
                >
                  <Button
                    // Mantenemos el componente Button para los estilos
                    variant={path === "#" ? "outline-secondary" : "primary"}
                    size="sm"
                    className="category-button"
                  >
                    {category}
                  </Button>
                </Link>
              );
            })}
          </div>
        </Container>
      </div>
    </>
  );
}

export default EcommerceNavbar;
