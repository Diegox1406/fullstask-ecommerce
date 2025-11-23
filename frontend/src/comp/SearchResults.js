import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import { searchProducts } from "../services/api";
import { CartFill } from "react-bootstrap-icons";
import { useCart } from "../context/CartContext";

function SearchResults() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { addItem } = useCart();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true);
      const data = await searchProducts(searchQuery);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Error al buscar productos");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const priceToUse =
      product.oferta && product.precioOferta > 0
        ? product.precioOferta
        : product.price;
    const itemToAdd = {
      ...product,
      _id: product._id,
      price: priceToUse,
      isPromotion: false,
    };
    addItem(itemToAdd);
  };

  const formatPrice = (price) =>
    price ? price.toLocaleString("es-CL", { minimumFractionDigits: 0 }) : "N/A";

  if (loading) {
    return (
      <Container style={{ paddingTop: "100px", minHeight: "50vh" }}>
        <div className="text-center">
          <h2>Buscando "{query}"...</h2>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ paddingTop: "100px", minHeight: "50vh" }}>
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "100px", minHeight: "80vh" }}>
      <div className="mb-4">
        <h1>Resultados de búsqueda</h1>
        <p className="lead">
          {products.length === 0
            ? `No se encontraron productos para "${query}"`
            : `Se encontraron ${products.length} producto(s) para "${query}"`}
        </p>
      </div>

      {products.length > 0 && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {products.map((product) => {
            const isOnOffer =
              product.oferta === true && product.precioOferta > 0;
            const displayPrice = isOnOffer
              ? product.precioOferta
              : product.price;
            const oldPrice = isOnOffer ? product.price : null;

            return (
              <Col key={product._id}>
                <Link
                  to={`/producto/${product._id}`}
                  className="text-decoration-none"
                >
                  <Card className="h-100 shadow-sm border-0 hover-lift">
                    <Card.Img
                      variant="top"
                      src={
                        product.image?.url ||
                        product.image ||
                        "https://placehold.co/400x300/cccccc/333333?text=IMAGEN+NO+DISPONIBLE"
                      }
                      alt={product.name}
                      style={{ objectFit: "cover", height: "250px" }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-dark">
                        {product.name}
                      </Card.Title>
                      <Card.Text className="text-muted flex-grow-1">
                        {product.description
                          ? product.description.substring(0, 80) + "..."
                          : "Sin descripción."}
                      </Card.Text>
                      <div className="mt-auto">
                        {isOnOffer && (
                          <span className="text-decoration-line-through text-danger me-2">
                            ${formatPrice(oldPrice)}
                          </span>
                        )}
                        <h5
                          className={`d-inline ${
                            isOnOffer ? "text-success" : "text-primary"
                          }`}
                        >
                          ${formatPrice(displayPrice)}
                        </h5>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-white border-top-0 p-3">
                      <Button
                        variant="warning"
                        size="sm"
                        className="category-button w-100"
                        style={{
                          backgroundColor: "#fedf9f",
                          border: "none",
                          color: "#000",
                        }}
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <CartFill className="me-2" /> Agregar al Carrito
                      </Button>
                    </Card.Footer>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default SearchResults;
