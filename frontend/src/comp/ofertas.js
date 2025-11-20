import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { CartFill } from "react-bootstrap-icons";
import { getOffers } from "../services/api";
import { useCart } from "../context/CartContext";

const Ofertas = () => {
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getOffers();
        setOfferProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar ofertas:", err);
        setError("No se pudieron cargar las ofertas. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

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
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  if (loading)
    return (
      <Container style={{ paddingTop: "100px", minHeight: "50vh" }}>
        <h2 className="text-center">Cargando ofertas...</h2>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Container>
    );
  if (error)
    return (
      <Container style={{ paddingTop: "100px", minHeight: "50vh" }}>
        <div className="alert alert-danger text-center">{error}</div>
      </Container>
    );
  if (offerProducts.length === 0)
    return (
      <Container style={{ paddingTop: "100px", minHeight: "50vh" }}>
        <div className="alert alert-info text-center">
          ¡Ups! No encontramos ofertas disponibles en este momento.
        </div>
      </Container>
    );

  const formatPrice = (price) =>
    price ? price.toLocaleString("es-CL", { minimumFractionDigits: 0 }) : "N/A";

  return (
    <Container className="mt-2 pt-5 mb-5" style={{ paddingTop: "90px" }}>
      {showAlert && (
        <Alert
          variant="success"
          onClose={() => setShowAlert(false)}
          dismissible
          style={{
            position: "fixed",
            top: 80,
            right: 20,
            zIndex: 1050,
            minWidth: "250px",
          }}
        >
          ✅ ¡Producto añadido al carrito!
        </Alert>
      )}
      <h2 className="display-4 text-center mb-4 text-primary">
        Ofertas Exclusivas ⚡
      </h2>
      <p className="text-center lead mb-5">
        Aprovecha nuestros precios bajos en equipos reacondicionados, seminuevos
        y accesorios seleccionados.
      </p>
      <Row xs={1} md={2} lg={3} className="g-4">
        {offerProducts.map((product) => {
          const isOnOffer = product.oferta === true && product.precioOferta > 0;
          const displayPrice = isOnOffer ? product.precioOferta : product.price;
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
    </Container>
  );
};

export default Ofertas;
