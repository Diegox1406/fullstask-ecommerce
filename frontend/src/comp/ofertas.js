import React, { useState, useEffect } from "react";
import "../comp/styles/Ofertas.css";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { CartFill } from "react-bootstrap-icons";
import { getOffers } from "../services/api";
import { useCart } from "../context/CartContext";

const Ofertas = () => {
  const [offerProducts, setOfferProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getOffers();
        setOfferProducts(data);
      } catch (err) {
        
      } finally {
        
      }
    };
    fetchOffers();
  }, []);

  const formatPrice = (price) =>
    price ? price.toLocaleString("es-CL", { minimumFractionDigits: 0 }) : "N/A";

  // ⭐ FUNCIÓN QUE FALTABA
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    const isOnOffer = product.oferta && product.precioOferta > 0;
    const finalPrice = isOnOffer ? product.precioOferta : product.price;

    const itemToAdd = {
      ...product,
      price: finalPrice,
      isPromotion: true,
    };

    addItem(itemToAdd);
    setShowAlert(true);

    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <Container className="pt-5 mb-5" style={{ paddingTop: "90px" }}>
      <h2 className="display-4 text-center mb-4 text-primary">
        Ofertas Exclusivas ⚡
      </h2>

      {showAlert && (
        <Alert variant="success" className="text-center">
          Producto agregado al carrito ✔️
        </Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {offerProducts.map((product) => {
          const isOnOffer = product.oferta && product.precioOferta > 0;

          return (
            <Col key={product._id}>
              <Link to={`/producto/${product._id}`} className="text-decoration-none">

                <Card className="oferta-card">
                  <Card.Img
                    variant="top"
                    className="oferta-img"
                    src={
                      product.image?.url ||
                      product.image ||
                      "https://placehold.co/400x300/cccccc/333333?text=IMAGEN+NO+DISPONIBLE"
                    }
                  />

                  <Card.Body className="oferta-body">
                    <Card.Title className="oferta-title">{product.name}</Card.Title>

                    <Card.Text className="oferta-desc">
                      {product.description
                        ? product.description.substring(0, 80) + "..."
                        : "Sin descripción."}
                    </Card.Text>

                    <div className="mt-auto d-flex flex-column">
                      {isOnOffer && (
                        <span className="offer-old-price">
                          ${formatPrice(product.price)}
                        </span>
                      )}

                      <span className="offer-new-price">
                        ${formatPrice(isOnOffer ? product.precioOferta : product.price)}
                      </span>
                    </div>
                  </Card.Body>

                  <Card.Footer className="bg-transparent border-0 p-3">
                    <Button
                      className="oferta-btn"
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
