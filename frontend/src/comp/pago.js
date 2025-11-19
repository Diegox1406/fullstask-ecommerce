import React from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

const Pago = () => {
  const inputStyle = {
    backgroundColor: "#fedf9f",
    border: "1px solid #e4c677",
    borderRadius: "8px",
    padding: "10px"
  };

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
      <h3 className="mb-4">Checkout</h3>

      {/* CONTACTO */}
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <h5>Contacto</h5>
          <a href="/login">Iniciar sesión</a>
        </div>
        <Form.Control type="email" placeholder="Correo electrónico" className="mb-2" style={inputStyle} />
        <Form.Check type="checkbox" label="Suscribirse para recibir ofertas" />
      </div>

      {/* ENTREGA */}
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <h5>Entrega</h5>
          <span>Método de envío</span>
        </div>
        <Form.Select className="mb-2" style={inputStyle}>
          <option>Envío a domicilio</option>
          <option>Recojo en tienda</option>
        </Form.Select>

        <Row className="mb-2">
          <Col><Form.Control placeholder="Nombre" style={inputStyle} /></Col>
          <Col><Form.Control placeholder="Apellido" style={inputStyle} /></Col>
        </Row>

        <Form.Control placeholder="Dirección" className="mb-2" style={inputStyle} />

        <Row className="mb-2">
          <Col><Form.Control placeholder="Referencia" style={inputStyle} /></Col>
          <Col><Form.Control placeholder="Distrito" style={inputStyle} /></Col>
          <Col><Form.Control placeholder="Código Postal" style={inputStyle} /></Col>
        </Row>

        <Form.Control placeholder="Celular" className="mb-2" style={inputStyle} />
      </div>

      {/* PAGO */}
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <h5>Método de pago</h5>
        </div>

        <Form.Check
          type="radio"
          name="pago"
          label="Izipay | Tarjetas de Crédito y Débito | Cuotas sin interés con BBVA, Interbank y Diners"
          defaultChecked
          className="mb-2"
        />

        <Card className="p-3 mb-3" style={{ backgroundColor: "#fff3e0", borderRadius: "8px" }}>
          <p style={{ margin: 0 }}>
            Después de hacer clic en <strong>“Finalizar compra”</strong>, serás redirigido a Izipay | Tarjetas de Crédito y Débito | Cuotas sin interés con BBVA, Interbank y Diners para completar tu compra de forma segura.
          </p>
        </Card>

        <Form.Check
          type="radio"
          name="pago"
          label="Pago contra entrega"
          className="mb-4"
        />
      </div>

      <Button className="w-100" variant="primary" size="lg">
        Finalizar compra
      </Button>
    </div>
  );
};

export default Pago;
