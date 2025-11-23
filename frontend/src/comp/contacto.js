import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./styles/Contacto.css";

function Contactanos() {
  return (
    <Container className="contacto-container">
      <div className="contacto-header text-center mb-5">
        <h1 className="contacto-title">Contáctanos</h1>
        <p className="contacto-subtitle">Estamos aquí para ayudarte</p>
      </div>

      <Card className="contacto-card shadow-lg">
        <Row className="g-0">
          {/* Left Column - Google Maps */}
          <Col md={6}>
            <div className="maps-container">
              <h5 className="maps-title text-center mb-3">Nuestra Ubicación</h5>
              <div className="maps-embed">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.8632812499997!2d-77.0968519247731!3d-12.077852088173937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c9b4c0c0c0c1%3A0x1234567890abcdef!2sC.C.%20Shopping%20Center%2C%20San%20Miguel%2C%20Lima%2C%20Peru!5e0!3m2!1sen!2spe!4v1234567890123!5m2!1sen!2spe"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: "15px" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de iPhoneKey en Shopping Center San Miguel"
                ></iframe>
              </div>
            </div>
          </Col>

          {/* Right Column - Contact Information */}
          <Col md={6}>
            <div className="contact-info p-4">
              <h5 className="contact-info-title text-center mb-4">
                Información de Contacto
              </h5>

              {/* Address */}
              <div className="contact-item mb-4">
                <div className="contact-details">
                  <h6 className="contact-label">Dirección</h6>
                  <p className="contact-text">
                    C.C. Shopping Center tda. 66
                    <br />
                    San Miguel, Lima, Peru
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="contact-item mb-4">
                <div className="contact-details">
                  <h6 className="contact-label">Teléfono</h6>
                  <p className="contact-text">
                    <a href="tel:+51934104798" className="contact-link">
                      +51 934 104 798
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="contact-item mb-4">
                <div className="contact-details">
                  <h6 className="contact-label">Email</h6>
                  <p className="contact-text">
                    <a
                      href="mailto:Ventas.iphonekey@hotmail.com"
                      className="contact-link"
                    >
                      Ventas.iphonekey@hotmail.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="contact-item mb-4">
                <div className="contact-details">
                  <h6 className="contact-label">Horario</h6>
                  <p className="contact-text">
                    Lunes a Viernes: 9:00 AM - 7:00 PM
                    <br />
                    Sábados: 9:00 AM - 2:00 PM
                    <br />
                    Domingos: Cerrado
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default Contactanos;
