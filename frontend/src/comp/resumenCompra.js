import React, { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

const ResumenCompra = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Traer los productos desde localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(storedCart);
  }, []);

  // Calcular subtotal
  const subtotal = items.reduce((acc, p) => acc + (p.price || p.precioOferta) * (p.quantity || p.qty), 0);
  const envio = 0; // envío gratis
  const total = subtotal + envio;

  return (
    <Card className="p-3 shadow-sm" style={{ borderRadius: "12px", backgroundColor: "#fedf9f" }}>
      <h5 className="mb-3">Resumen de compra</h5>

      {items.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        items.map((p) => (
          <div key={p.id} className="d-flex align-items-center mb-2">
            <img src={p.image || p.imagenUrl} alt={p.name || p.nombre} width="60" height="60" className="me-2 rounded" />
            <div className="flex-grow-1">
              <p className="m-0 fw-bold">{p.name || p.nombre}</p>
              <small>Cant: {p.quantity || p.qty}</small>
            </div>
            <span className="fw-bold">S/ {(p.price || p.precioOferta) * (p.quantity || p.qty)}</span>
          </div>
        ))
      )}

      <Form.Control placeholder="Código de descuento" className="mt-3 mb-2" />
      <Button variant="primary" size="sm">Aplicar</Button>

      <hr />

      <div className="d-flex justify-content-between">
        <span>Subtotal</span>
        <strong>S/ {subtotal.toFixed(2)}</strong>
      </div>
      <div className="d-flex justify-content-between">
        <span>Envío</span>
        <strong className="text-success">Gratis</strong>
      </div>

      <hr />

      <div className="d-flex justify-content-between fs-5 fw-bold">
        <span>Total</span>
        <span>S/ {total.toFixed(2)}</span>
      </div>
    </Card>
  );
};

export default ResumenCompra;
