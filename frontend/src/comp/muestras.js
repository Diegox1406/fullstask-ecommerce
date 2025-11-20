import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useState, useEffect } from "react";
import { getAllProducts } from "../services/api";
import { Link } from "react-router-dom";
import "./styles/muestras.css";

function Muestras() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const productsData = await getAllProducts();

        // Get 3 random products
        const shuffled = [...productsData].sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 3);

        setProducts(randomProducts);
      } catch (err) {
        console.error("Error fetching random products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  // Format price function
  const formatPrice = (price) =>
    price ? price.toLocaleString("es-CL", { minimumFractionDigits: 0 }) : "N/A";

  // Fallback data in case of error or no products
  const fallbackData = [
    {
      _id: "fallback-1",
      image: "https://via.placeholder.com/300x400?text=Producto+Destacado",
      name: "Destacado",
      price: 299000,
      condicion: "Nuevo",
      type: "tall",
    },
    {
      _id: "fallback-2",
      image: "https://via.placeholder.com/400x200?text=Oferta+Especial",
      name: "Oferta Especial",
      price: 199000,
      oferta: true,
      precioOferta: 149000,
      condicion: "Excelente",
      type: "wide",
    },
    {
      _id: "fallback-3",
      image: "https://via.placeholder.com/400x200?text=Nuevo+Lanzamiento",
      name: "Nuevo Lanzamiento",
      price: 399000,
      condicion: "Nuevo",
      type: "wide",
    },
  ];

  const displayData = products.length === 3 ? products : fallbackData;

  if (loading) {
    return (
      <Container>
        <div className="muestras-container py-4">
          <div className="muestras-flex-container">
            <div className="tall-card-column">
              <Card className="muestras-card tall-card">
                <Card.Body className="muestras-body">
                  <Card.Text>Cargando productos destacados...</Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="wide-cards-column">
              <Card className="muestras-card wide-card">
                <Card.Body className="muestras-body">
                  <Card.Text>Cargando...</Card.Text>
                </Card.Body>
              </Card>
              <Card className="muestras-card wide-card">
                <Card.Body className="muestras-body">
                  <Card.Text>Cargando...</Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="muestras-container py-4">
        {/* Flexbox Container */}
        <div className="muestras-flex-container">
          {/* Tall Card Column */}
          <div className="tall-card-column">
            <Link
              to={`/producto/${displayData[0]._id}`}
              className="muestras-card-link"
            >
              <Card className="muestras-card tall-card">
                <Card.Img
                  variant="top"
                  src={displayData[0]?.image?.url || displayData[0]?.image}
                  className="muestras-image"
                  alt={displayData[0]?.name}
                />
                <Card.Body className="muestras-body">
                  <Card.Title>{displayData[0]?.name}</Card.Title>
                  {/* Price Display */}
                  {displayData[0]?.oferta && displayData[0]?.precioOferta ? (
                    <div>
                      <span className="muestras-original-price">
                        ${formatPrice(displayData[0]?.price)}
                      </span>
                      <span className="muestras-price muestras-offer-price">
                        ${formatPrice(displayData[0]?.precioOferta)}
                      </span>
                    </div>
                  ) : (
                    <div className="muestras-price">
                      ${formatPrice(displayData[0]?.price)}
                    </div>
                  )}
                  <div className="muestras-condition">
                    {displayData[0]?.condicion}
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </div>

          {/* Wide Cards Column */}
          <div className="wide-cards-column">
            <Link
              to={`/producto/${displayData[1]._id}`}
              className="muestras-card-link"
            >
              <Card className="muestras-card wide-card">
                <Card.Img
                  variant="top"
                  src={displayData[1]?.image?.url || displayData[1]?.image}
                  className="muestras-image"
                  alt={displayData[1]?.name}
                />
                <Card.Body className="muestras-body">
                  <Card.Title>{displayData[1]?.name}</Card.Title>
                  {/* Price Display */}
                  {displayData[1]?.oferta && displayData[1]?.precioOferta ? (
                    <div>
                      <span className="muestras-original-price">
                        ${formatPrice(displayData[1]?.price)}
                      </span>
                      <span className="muestras-price muestras-offer-price">
                        ${formatPrice(displayData[1]?.precioOferta)}
                      </span>
                    </div>
                  ) : (
                    <div className="muestras-price">
                      ${formatPrice(displayData[1]?.price)}
                    </div>
                  )}
                  <div className="muestras-condition">
                    {displayData[1]?.condicion}
                  </div>
                </Card.Body>
              </Card>
            </Link>

            <Link
              to={`/producto/${displayData[2]._id}`}
              className="muestras-card-link"
            >
              <Card className="muestras-card wide-card">
                <Card.Img
                  variant="top"
                  src={displayData[2]?.image?.url || displayData[2]?.image}
                  className="muestras-image"
                  alt={displayData[2]?.name}
                />
                <Card.Body className="muestras-body">
                  <Card.Title>{displayData[2]?.name}</Card.Title>
                  {/* Price Display */}
                  {displayData[2]?.oferta && displayData[2]?.precioOferta ? (
                    <div>
                      <span className="muestras-original-price">
                        ${formatPrice(displayData[2]?.price)}
                      </span>
                      <span className="muestras-price muestras-offer-price">
                        ${formatPrice(displayData[2]?.precioOferta)}
                      </span>
                    </div>
                  ) : (
                    <div className="muestras-price">
                      ${formatPrice(displayData[2]?.price)}
                    </div>
                  )}
                  <div className="muestras-condition">
                    {displayData[2]?.condicion}
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Muestras;
