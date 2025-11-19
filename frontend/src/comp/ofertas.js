import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { CartFill } from 'react-bootstrap-icons';

// Datos simulados de productos en oferta
const offerProducts = [
  { id: 1, name: "iPhone 13 Pro (Reacondicionado)", price: 799.99, oldPrice: 999.99, image: "https://placehold.co/400x300/a3e1f5/000?text=iPhone+13+Oferta", description: "Unidad de alta calidad." },
  { id: 2, name: "AirPods Pro 2da Gen", price: 175.00, oldPrice: 249.00, image: "https://placehold.co/400x300/f5a3e1/000?text=AirPods+Oferta", description: "Con cancelación de ruido." },
  { id: 3, name: "Cubo Cargador 20W", price: 19.99, oldPrice: 29.99, image: "https://placehold.co/400x300/e1f5a3/000?text=Cargador+Oferta", description: "Carga rápida USB-C." },
  { id: 4, name: "Case de Silicón (Colores Varios)", price: 9.99, oldPrice: 15.00, image: "https://placehold.co/400x300/a3f5a3/000?text=Case+Oferta", description: "Para iPhone 14/15." },
  { id: 5, name: "Apple Watch SE (Usado)", price: 199.99, oldPrice: 299.99, image: "https://placehold.co/400x300/f5e1a3/000?text=Watch+Oferta", description: "Reacondicionado, perfecto estado." },
];

const Ofertas = () => {
  return (
    <Container className="mt-2 pt-5 mb-5"> 
      <h2 className="display-4 text-center mb-4 text-primary">Ofertas Exclusivas ⚡</h2>
      <p className="text-center lead mb-5">
        Aprovecha nuestros precios bajos en equipos reacondicionados, seminuevos y accesorios seleccionados.
      </p>

      <Row xs={1} md={2} lg={3} className="g-4">
        {offerProducts.map((product) => (
          <Col key={product.id}>
            {/* El card completo es un Link que dirige a la ruta de detalle de producto. */}
            <Link to={`/producto/${product.id}`} className="text-decoration-none">
              <Card className="h-100 shadow-sm border-0 hover-lift">
                <Card.Img 
                  variant="top" 
                  src={product.image} 
                  alt={product.name} 
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/cccccc/333333?text=IMAGEN+NO+DISPONIBLE"; }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-dark">{product.name}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">{product.description}</Card.Text>
                  
                  <div className="mt-auto">
                    {/* Precio anterior tachado */}
                    <span className="text-decoration-line-through text-danger me-2">${product.oldPrice.toFixed(2)}</span>
                    {/* Precio de oferta */}
                    <h5 className="text-success d-inline">
                      ${product.price.toFixed(2)}
                    </h5>
                  </div>
                </Card.Body>
                
                <Card.Footer className="bg-white border-top-0 p-3">
                  {/* Botón para simular añadir al carrito. Se usa e.preventDefault() para no seguir el Link del Card. */}
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="category-button w-100" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); 
                      // NOTA: Reemplazar 'alert' con un modal o toast en producción
                      alert(`Producto "${product.name}" añadido al carrito! (Simulación)`);
                    }}
                  >
                    <CartFill className="me-2" /> Agregar al Carrito
                  </Button>
                </Card.Footer>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Ofertas;
