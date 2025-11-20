import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/api";
import "./styles/Novedades.css";

function Novedades() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const productsData = await getAllProducts();

        // Sort by createdAt date (newest first) and take first 4
        const recentProducts = productsData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);

        setProducts(recentProducts);
      } catch (err) {
        console.error("Error fetching recent products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="novedades-container">
          <Row className="mb-4">
            <h1 className="h2 fw-bold text-left">Novedades</h1>
          </Row>
          <div className="text-center">Cargando novedades...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="novedades-container">
        <Row className="mb-4">
          <h1 className="h2 fw-bold text-left">Novedades</h1>
        </Row>
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map((product) => (
            <Col key={product._id}>
              <Link
                to={`/producto/${product._id}`}
                className="text-decoration-none"
              >
                <Card className="novedades-card">
                  <Card.Img
                    variant="top"
                    src={product.image?.url || "/placeholder-image.jpg"}
                    className="novedades-image"
                    alt={product.name}
                  />
                  <Card.Body className="novedades-body">
                    <Card.Title>{product.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
        {products.length === 0 && (
          <div className="text-center">No hay novedades disponibles</div>
        )}
      </div>
    </Container>
  );
}

export default Novedades;
