import { Container, Row, Col, Stack, NavLink } from "react-bootstrap";
import { Facebook, Instagram } from "react-bootstrap-icons";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";
import "./styles/Footer.css";

function Footer() {
  return (
    <footer>
      <div style={{ backgroundColor: "#fedf9f" }}>
        <Container>
          <Row className="p-4 justify-content-center">
            {/* IphoneKey Column */}
            <Col xs={12} md={6} lg={5} className="mb-4 mb-md-0">
              <div className="footer-column">
                <h6 className="footer-title mb-3 text-start">IphoneKey</h6>
                <Stack gap={3}>
                  <div className="footer-links">
                    <NavLink href="/ofertas" className="footer-link text-start">
                      Ofertas
                    </NavLink>
                  </div>
                  <div className="footer-links">
                    <NavLink
                      href="/promociones"
                      className="footer-link text-start"
                    >
                      Promociones
                    </NavLink>
                  </div>
                  <div className="footer-links">
                    <NavLink
                      href="/accesorios"
                      className="footer-link text-start"
                    >
                      Accesorios
                    </NavLink>
                  </div>
                  <div className="footer-links">
                    <NavLink
                      href="/cotizaciones"
                      className="footer-link text-start"
                    >
                      Cotizaciones
                    </NavLink>
                  </div>
                  <div className="footer-links">
                    <NavLink
                      href="/contacto"
                      className="footer-link text-start"
                    >
                      Contacto
                    </NavLink>
                  </div>
                </Stack>
              </div>
            </Col>

            {/* Nuestras Redes Column */}
            <Col xs={12} md={6} lg={5}>
              <div className="footer-column">
                <h6 className="footer-title mb-3 text-start">Nuestras Redes</h6>
                <Stack gap={3}>
                  {/* Instagram */}
                  <div className="footer-links">
                    <NavLink
                      href="https://www.instagram.com/iphonekeyperu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link text-start"
                    >
                      <Instagram size={24} className="me-2" />
                      Instagram
                    </NavLink>
                  </div>

                  {/* Facebook */}
                  <div className="footer-links">
                    <NavLink
                      href="https://www.facebook.com/share/1RZPXufJty/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link text-start"
                    >
                      <Facebook size={24} className="me-2" />
                      Facebook
                    </NavLink>
                  </div>

                  {/* TikTok */}
                  <div className="footer-links">
                    <NavLink
                      href="https://www.tiktok.com/@iphonekeyperu?_r=1&_t=ZS-91Z6VgZWzQO"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link text-start"
                    >
                      <FaTiktok size={24} className="me-2" />
                      TikTok
                    </NavLink>
                  </div>

                  {/* WhatsApp */}
                  <div className="footer-links">
                    <NavLink
                      href="https://wa.me/51934104798"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link text-start"
                    >
                      <FaWhatsapp size={24} className="me-2" />
                      WhatsApp
                    </NavLink>
                  </div>
                </Stack>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Copyright Bar */}
      <div style={{ backgroundColor: "#333", color: "white" }}>
        <Container>
          <Row className="py-3">
            <Col className="text-center">
              <small>© 2024 Iphone Key. Todos los derechos reservados.</small>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
