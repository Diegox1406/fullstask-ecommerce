import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function Promociones() {
  const cardData = [
    {
      image:
        "https://http2.mlstatic.com/D_NQ_NP_2X_815144-MHN83582756668_042025-T.webp",
      title: "Promo 1",
      text: "Texto de novedad 1.",
    },
    {
      image:
        "https://laganga.com/media/catalog/product/cache/48ac97e70dc64bafe85e6c37e44b155d/4/7/474_1.jpeg",
      title: "Promo 2",
      text: "Texto de novedad 2.",
    },
    {
      image:
        "https://laganga.com/media/catalog/product/cache/48ac97e70dc64bafe85e6c37e44b155d/5/9/597_1.jpeg",
      title: "Promo 3",
      text: "Texto de novedad 3.",
    },
  ];

  return (
    <Container>
      <div className="novedades-container">
        <Row className="mb-4">
          <Col className="text-center">
            <h1 className="display-4 fw-bold">Promociones</h1>
          </Col>
        </Row>
        <Row xs={1} md={2} lg={3} className="g-4">
          {cardData.map((card, idx) => (
            <Col key={idx}>
              <Card className="novedades-card">
                <Card.Img
                  variant="top"
                  src={card.image}
                  className="novedades-image"
                />
                <Card.Body className="novedades-body">
                  <Card.Title>{card.title}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default Promociones;
