import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import { GeoAlt, Cart, Search } from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { searchProducts } from "../services/api";

function EcommerceNavbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const linkMap = {
    Inicio: "/",
    Accesorios: "/accesorios",
    Promociones: "/promociones",
    Cotizaciones: "/cotizaciones",
    Ofertas: "/ofertas",
    Contacto: "/contacto",
  };

  const categories = [
    "Inicio",
    "Ofertas",
    "Promociones",
    "Accesorios",
    "Cotizaciones",
    "Contacto",
  ];
  const getPath = (category) => linkMap[category] || "#";

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        performSearch(searchQuery.trim());
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      const results = await searchProducts(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`);
    setShowResults(false);
    setSearchQuery("");
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow for clicks on results
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="custom-navbar navbar-dark-text bg-white"
        fixed="top"
      >
        <Container>
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
            <Form
              className="d-flex mx-auto position-relative"
              style={{ width: "400px" }}
              onSubmit={handleSearchSubmit}
            >
              <Form.Control
                type="search"
                placeholder="Buscar productos..."
                className="me-2 custom-search-input"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 2 && setShowResults(true)}
                onBlur={handleSearchBlur}
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
                type="submit"
                style={{ borderRadius: "25px", padding: "10px 20px" }}
                disabled={!searchQuery.trim()}
              >
                <Search />
              </Button>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="search-results-dropdown position-absolute top-100 start-0 end-0 mt-1 bg-white border rounded shadow-lg z-3">
                  {isSearching ? (
                    <div className="p-3 text-center text-muted">
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Buscando...</span>
                      </div>
                      <span className="ms-2">Buscando...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="p-2 border-bottom bg-light">
                        <small className="text-muted">
                          {searchResults.length} resultado(s) encontrado(s)
                        </small>
                      </div>
                      <div
                        className="search-results-list"
                        style={{ maxHeight: "300px", overflowY: "auto" }}
                      >
                        {searchResults.map((product) => (
                          <div
                            key={product._id}
                            className="search-result-item p-3 border-bottom"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleProductClick(product._id)}
                            onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                          >
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  product.image?.url ||
                                  product.image ||
                                  "https://placehold.co/50x50/cccccc/333333?text=IMG"
                                }
                                alt={product.name}
                                className="me-3"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                              <div className="flex-grow-1">
                                <div className="fw-semibold">
                                  {product.name}
                                </div>
                                <small className="text-muted">
                                  $
                                  {product.price?.toLocaleString("es-CL", {
                                    minimumFractionDigits: 0,
                                  })}
                                  {product.oferta &&
                                    product.precioOferta > 0 && (
                                      <span className="text-success ms-2">
                                        Oferta: $
                                        {product.precioOferta?.toLocaleString(
                                          "es-CL",
                                          { minimumFractionDigits: 0 }
                                        )}
                                      </span>
                                    )}
                                </small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : searchQuery.length > 2 ? (
                    <div className="p-3 text-center text-muted">
                      No se encontraron productos para "{searchQuery}"
                    </div>
                  ) : null}
                </div>
              )}
            </Form>
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
                  {cartCount}
                </span>
              </Nav.Link>
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      className="btn btn-sm btn-outline-secondary me-2"
                      to="/admin"
                      style={{ borderRadius: "25px", padding: "5px 15px" }}
                    >
                      🛠️ Panel Admin
                    </Link>
                  )}
                  <span className="text-muted me-2">
                    Hola, {user?.name || user?.email || "Usuario"}
                  </span>
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
      <div className="second-navbar-row py-2" style={{ marginTop: "65px" }}>
        <Container>
          <div className="category-buttons-container d-flex flex-wrap justify-content-center">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={getPath(category)}
                className="mx-1 my-1 text-decoration-none"
              >
                <Button
                  variant={
                    getPath(category) === "#" ? "outline-secondary" : "primary"
                  }
                  size="sm"
                  className="category-button"
                >
                  {category}
                </Button>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}

export default EcommerceNavbar;
