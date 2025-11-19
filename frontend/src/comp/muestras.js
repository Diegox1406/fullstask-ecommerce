import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

function Muestras() {
  const cardData = [
    {
      image:
        "https://http2.mlstatic.com/D_NQ_NP_2X_815144-MHN83582756668_042025-T.webp",
      title: "Destacado",
      text: "Producto destacado de la semana",
      type: "tall",
    },
    {
      image:
        "https://laganga.com/media/catalog/product/cache/48ac97e70dc64bafe85e6c37e44b155d/4/7/474_1.jpeg",
      title: "Oferta Especial",
      text: "Oferta limitada por tiempo",
      type: "wide",
    },
    {
      image:
        "https://laganga.com/media/catalog/product/cache/48ac97e70dc64bafe85e6c37e44b155d/5/9/597_1.jpeg",
      title: "Nuevo Lanzamiento",
      text: "Descubre nuestro nuevo producto",
      type: "wide",
    },
  ];

  return (
    <Container>
      <div className="muestras-container py-4">
        {/* Flexbox Container */}
        <div className="muestras-flex-container">
          {/* Tall Card Column */}
          <div className="tall-card-column">
            <Card className="muestras-card tall-card">
              <Card.Img
                variant="top"
                src={cardData[0].image}
                className="muestras-image"
              />
              <Card.Body className="muestras-body">
                <Card.Title>{cardData[0].title}</Card.Title>
                <Card.Text>{cardData[0].text}</Card.Text>
              </Card.Body>
            </Card>
          </div>

          {/* Wide Cards Column */}
          <div className="wide-cards-column">
            <Card className="muestras-card wide-card">
              <Card.Img
                variant="top"
                src={cardData[1].image}
                className="muestras-image"
              />
              <Card.Body className="muestras-body">
                <Card.Title>{cardData[1].title}</Card.Title>
                <Card.Text>{cardData[1].text}</Card.Text>
              </Card.Body>
            </Card>

            <Card className="muestras-card wide-card">
              <Card.Img
                variant="top"
                src={cardData[2].image}
                className="muestras-image"
              />
              <Card.Body className="muestras-body">
                <Card.Title>{cardData[2].title}</Card.Title>
                <Card.Text>{cardData[2].text}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Muestras;
