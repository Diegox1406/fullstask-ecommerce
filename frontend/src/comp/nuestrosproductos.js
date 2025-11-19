import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function NuestrosProductos() {
  const cardData = [
    {
      image:
        "https://http2.mlstatic.com/D_NQ_NP_2X_815144-MHN83582756668_042025-T.webp",
      title: "Celular A",
      text: "300 $",
    },
    {
      image:
        "https://laganga.com/media/catalog/product/cache/48ac97e70dc64bafe85e6c37e44b155d/4/7/474_1.jpeg",
      title: "Celular B",
      text: "200 $",
    },
    {
      image:
        "https://laganga.com/media/catalog/product/cache/48ac97e70dc64bafe85e6c37e44b155d/5/9/597_1.jpeg",
      title: "Celular C",
      text: "300 $",
    },
    {
      image:
        "https://laganga.com/media/catalog/product/cache/48ac97e70dc64bafe85e6c37e44b155d/5/9/597_1.jpeg",
      title: "Celular D",
      text: "400 $",
    },
    {
      image:
        "https://laganga.com/media/catalog/product/cache/48ac97e70dc64bafe85e6c37e44b155d/5/9/597_1.jpeg",
      title: "Celular E",
      text: "250 $",
    },
  ];

  return (
    <Container>
      <div className="NuestrosProductos-container">
        <Row className="mb-4">
          <h1 className="h2 fw-bold text-left">Nuestros Productos</h1>
        </Row>
        <Row xs={1} md={2} lg={5} className="g-2">
          {cardData.map((card, idx) => (
            <Col key={idx}>
              <Card className="NuestrosProductos-card wide-card">
                <Card.Img
                  variant="top"
                  src={card.image}
                  className="NuestrosProductos-image"
                />
                <Card.Body className="NuestrosProductos-body wide-body"></Card.Body>
              </Card>
              <div className="product-info text-center mt-2">
                <h6 className="product-title mb-1">{card.title}</h6>
                <p className="product-price mb-0">{card.text}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default NuestrosProductos;
