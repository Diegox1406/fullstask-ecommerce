import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import OfertasCarousel from "./ofertasCarousel";

const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  return (
    <Container className="mt-5 pt-5">

      {/* Título y link */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">REVISA TU PEDIDO</h2>

        <Link
          to="/ofertas"
          style={{ textDecoration: "none", fontWeight: "500", color: "#007bff" }}
        >
          Seguir Comprando
        </Link>
      </div>
      <br />

      {/* Header columnas */}
      <Row className="fw-bold border-bottom pb-2 mb-3 text-center">
        <Col>PRODUCTO</Col>
        <Col>CANTIDAD</Col>
        <Col>TOTAL</Col>
      </Row>

      {cartItems.length === 0 ? (
        <h4>Tu carrito está vacío</h4>
      ) : (
        cartItems.map((item) => (
          <Row key={item.id} className="py-4 border-bottom align-items-center">
            <Col md={4} className="d-flex">
              <Image
                src={item.imagenUrl}
                style={{ width: "130px", height: "130px", borderRadius: "15px", objectFit: "cover", background: "#f9dba4" }}
              />

              <div className="ms-3">
                <div style={{ fontSize: "12px", fontWeight: "600" }}>MARCA</div>
                <div style={{ fontSize: "28px", fontWeight: "800", lineHeight: "1" }}>{item.nombre}</div>

                <div className="mt-2" style={{ fontSize: "13px", fontWeight: "600" }}>
                  ESPECIFICACIONES:
                </div>

                <p style={{ fontSize: "12px", marginTop: "4px", maxWidth: "260px" }}>
                  {item.descripcion}
                </p>
              </div>
            </Col>

            <Col md={4} className="text-center">
              <div
                className="d-inline-flex align-items-center px-3 py-2"
                style={{ background: "#f9dba4", borderRadius: "25px", fontSize: "18px", fontWeight: "600" }}
              >
                <span style={{ cursor: "pointer" }} onClick={() => updateQuantity(item.id, -1)}>−</span>
                <span className="mx-3">{item.quantity}</span>
                <span style={{ cursor: "pointer" }} onClick={() => updateQuantity(item.id, +1)}>+</span>
              </div>
              <br />
              <Button variant="link" className="mt-2 p-0" style={{ color: "#007BFF" }}
                onClick={() => removeItem(item.id)}
              >
                Eliminar
              </Button>
            </Col>

            {/* Total */}
            <Col md={4} className="text-center">
              <div style={{ textDecoration: "line-through", color: "#888" }}>
                S/ {(item.precioOferta * 1.15).toFixed(2)}
              </div>

              <div style={{ fontWeight: "800", fontSize: "24px" }}>
                S/ {(item.precioOferta * item.quantity).toFixed(2)}
              </div>

              <div style={{ fontSize: "12px", marginBottom: "8px" }}>
                ó S/108 por 36 meses
              </div>

              <Link to="/checkout">
                <Button variant="warning" className="w-100 mt-3">Ir al Pago</Button>
              </Link>

            </Col>

          </Row>
        ))
      )}

      {cartItems.length > 0 && (
        <>
          <h2 className="mt-5 mb-3 text-center">AGRÉGALO A TU PEDIDO</h2>
          <OfertasCarousel />
        </>
      )}


    </Container>
  );
};

export default Carrito;
