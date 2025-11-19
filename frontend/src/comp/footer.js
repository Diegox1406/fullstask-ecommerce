import {
  Container,
  Row,
  Col,
  Stack,
  Image,
  Nav,
  NavLink,
} from "react-bootstrap";
import { Facebook, Instagram, Book } from "react-bootstrap-icons";

function Footer() {
  return (
    <footer>
      <Container fluid>
        <Row className="p-4" style={{ backgroundColor: "#fedf9f" }}>
          {/* Productos Column */}
          <Col>
            <div className="footer-column">
              <h6 className="footer-title mb-3 text-start">Productos</h6>
              <Nav className="flex-column">
                <NavLink href="#" className="footer-link text-start">
                  iPhone 15 Series
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  iPhone 14 Series
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  iPhone 13 Series
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Accesorios
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Cables y Cargadores
                </NavLink>
              </Nav>
            </div>
          </Col>

          {/* Servicios Column */}
          <Col>
            <div className="footer-column">
              <h6 className="footer-title mb-3 text-start">Servicios</h6>
              <Nav className="flex-column">
                <NavLink href="#" className="footer-link text-start">
                  Reparación de Pantallas
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Cambio de Batería
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Soporte Técnico
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Garantía Extendida
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Consultoría
                </NavLink>
              </Nav>
            </div>
          </Col>

          {/* IphoneKey Column */}
          <Col>
            <div className="footer-column">
              <h6 className="footer-title mb-3 text-start">IphoneKey</h6>
              <Nav className="flex-column">
                <NavLink href="#" className="footer-link text-start">
                  Sobre Nosotros
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Nuestra Historia
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Trabaja con Nosotros
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Contacto
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Ubicaciones
                </NavLink>
              </Nav>
            </div>
          </Col>

          {/* Términos y Condiciones Column */}
          <Col>
            <div className="footer-column">
              <h6 className="footer-title mb-3 text-start">
                Términos y Condiciones
              </h6>
              <Nav className="flex-column">
                <NavLink href="#" className="footer-link text-start">
                  Política de Privacidad
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Términos de Uso
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Garantías
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Devoluciones
                </NavLink>
                <NavLink href="#" className="footer-link text-start">
                  Preguntas Frecuentes
                </NavLink>
              </Nav>
            </div>
          </Col>

          {/* Nuestras Redes Column */}
          <Col>
            <div className="footer-column">
              <h6 className="footer-title mb-3 text-start">Nuestras Redes</h6>
              <Stack gap={3}>
                {/* Facebook */}
                <div className="social-links">
                  <NavLink href="#" className="social-link text-start">
                    <Facebook size={24} className="me-2" />
                    Facebook
                  </NavLink>
                </div>

                {/* Instagram */}
                <div className="social-links">
                  <NavLink href="#" className="social-link text-start">
                    <Instagram size={24} className="me-2" />
                    Instagram
                  </NavLink>
                </div>

                {/* Libro de Reclamaciones */}
                <div className="social-links">
                  <NavLink href="#" className="social-link text-start">
                    <Book size={24} className="me-2" />
                    Libro de Reclamaciones
                  </NavLink>
                </div>
              </Stack>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Copyright Bar */}
      <div style={{ backgroundColor: "#333", color: "white" }}>
        <Container fluid>
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
