import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function Novedades() {
  const cardData = [
    {
      image:
        "https://http2.mlstatic.com/D_NQ_NP_2X_815144-MHN83582756668_042025-T.webp",
      title: "Novedad 1",
      text: "Texto de novedad 1.",
    },
    {
      image:
        "https://laganga.com/media/catalog/product/cache/48ac97e70dc64bafe85e6c37e44b155d/4/7/474_1.jpeg",
      title: "Card title 2",
      text: "Texto de novedad 2.",
    },
    {
      image:
        "https://laganga.com/media/catalog/product/cache/48ac97e70dc64bafe85e6c37e44b155d/5/9/597_1.jpeg",
      title: "Card title 3",
      text: "Texto de novedad 3.",
    },
    {
      image: "https://m.media-amazon.com/images/I/61k-BSDw8sL._AC_SL1500_.jpg",
      title: "Card title 4",
      text: "Texto de novedad 3.",
    },
  ];

  return (
    <Container>
      <div className="novedades-container">
        <Row className="mb-4">
          <h1 className="h2 fw-bold text-left">Novedades</h1>
        </Row>
        <Row xs={1} md={2} lg={4} className="g-4">
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
                  <Card.Text>{card.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default Novedades;
