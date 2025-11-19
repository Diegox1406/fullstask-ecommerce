import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./styles/Accesorios.css";

function Accesorios() {
  const accesorios = [
    {
      image:
        "https://coolboxpe.vtexassets.com/arquivos/ids/322387/1.jpg?v=638337641847370000",
      title: "Funda Transparente",
      text: "Protege tu iPhone con una funda resistente y ligera.",
    },
    {
      image:
        "https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/2909/PMP00002849084/full_image-1.jpeg",
      title: "Cargador Rápido 20W",
      text: "Carga tu dispositivo al 100% en el menor tiempo.",
    },
    {
      image:
        "https://oechsle.vteximg.com.br/arquivos/ids/15223399-800-800/2406088.jpg?v=638278730279200000",
      title: "Airpods",
      text: "Sonido envolvente y conexión estable sin cables.",
    },
    {
      image:
        "https://pe.tiendasishop.com/cdn/shop/files/WIA008ttBK_1.webp?v=1726512827&width=823",
      title: "Soporte Magnético",
      text: "Ideal para tu auto o escritorio, compatible con MagSafe.",
    },
    {
      image:
        "https://oechsle.vteximg.com.br/arquivos/ids/16448754/image-5c02b1022b9249108da9b6f4f27a7748.jpg?v=638326796517300000",
      title: "Cable Lightning Original",
      text: "Durabilidad y carga segura para tus dispositivos Apple.",
    },
    {
      image:
        "https://xiaomiperu.com/media/catalog/product/cache/deaf12c726c019462dcd02884cec40ac/i/n/integrdo_power_bank_azul.jpeg",
      title: "Power Bank 10,000 mAh",
      text: "Batería portátil para cargar tus dispositivos donde sea.",
    },
  ];

  return (
    <Container className="accesorios-container">
      <Row className="mb-4">
        <Col className="text-center">
          <h1 className="display-4 fw-bold">Accesorios</h1>
          <p className="lead text-muted">
            Explora nuestra colección de accesorios para mejorar tu experiencia
            móvil.
          </p>
        </Col>
      </Row>

      <Row xs={1} md={2} lg={3} className="g-4">
        {accesorios.map((item, idx) => (
          <Col key={idx}>
            <Card className="accesorio-card shadow-sm border-0">
              <div className="image-wrapper">
                <Card.Img
                  variant="top"
                  src={item.image}
                  className="accesorio-image"
                />
              </div>
              <Card.Body className="accesorio-body text-center">
                <Card.Title className="fw-semibold">{item.title}</Card.Title>
                <Card.Text>{item.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Accesorios;
