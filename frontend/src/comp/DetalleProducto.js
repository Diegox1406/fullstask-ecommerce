import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Alert, Card } from 'react-bootstrap'; // Importamos Alert
import { CartFill } from 'react-bootstrap-icons';

// NOTA: En una aplicación real, esta información se obtendría de una API o base de datos.
const getProductDetails = (id) => {
  // Simulación de búsqueda de datos
  const mockProducts = {
    1: { nombre: "iPhone 13 Pro (Reacondicionado)", descripcion: "Unidad de alta calidad, revisada y certificada. Pantalla Super Retina XDR de 6.1 pulgadas.", precioOferta: 799.99, estado: "Reacondicionado", imagenUrl: "https://placehold.co/800x600/a3e1f5/000?text=iPhone+13+DETALLE" },
    2: { nombre: "AirPods Pro 2da Gen", descripcion: "Audio espacial, cancelación activa de ruido y modo de transparencia adaptable.", precioOferta: 175.00, estado: "Nuevo", imagenUrl: "https://placehold.co/800x600/f5a3e1/000?text=AirPods+DETALLE" },
    3: { nombre: "Cubo Cargador 20W", descripcion: "Cargador USB-C de 20W. Ideal para iPhone 8 en adelante. Original.", precioOferta: 19.99, estado: "Nuevo", imagenUrl: "https://placehold.co/800x600/e1f5a3/000?text=CARGADOR+DETALLE" },
  };
  return mockProducts[id] || { nombre: "Producto No Encontrado", descripcion: "El artículo que buscas no está disponible.", precioOferta: 0, imagenUrl: "https://placehold.co/800x600/ccc/000?text=ERROR" };
};

const DetalleProducto = () => {
  // Obtiene el parámetro ID de la URL (definido en App.js como /producto/:id)
  const { id } = useParams();
  const producto = getProductDetails(id);
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para mostrar la confirmación

  const handleAddToCart = () => {
    // Simulación de añadir al carrito usando localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    currentCart.push({ ...producto, id: id, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(currentCart));

    // Muestra la alerta de confirmación
    setShowConfirmation(true);
    // Oculta la alerta después de 3 segundos
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  return (
    <Container className="mt-5 pt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          
          {/* Alerta de confirmación */}
          {showConfirmation && (
            <Alert 
              variant="success" 
              onClose={() => setShowConfirmation(false)} 
              dismissible 
              className="mt-3"
            >
              ¡<strong>{producto.nombre}</strong> añadido al carrito!
            </Alert>
          )}

          <Card className="shadow-lg border-0">
            <Row className="g-0">
              {/* Columna de Imagen */}
              <Col md={6}>
                <Image 
                  src={producto.imagenUrl} 
                  alt={producto.nombre} 
                  fluid 
                  rounded
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x600/cccccc/333333?text=IMAGEN+NO+DISPONIBLE"; }}
                />
              </Col>
              
              {/* Columna de Detalles y Botón */}
              <Col md={6} className="p-4 d-flex flex-column justify-content-between">
                <div>
                  <h1 className="display-6">{producto.nombre}</h1>
                  <p className="lead text-success my-3">
                    Precio Oferta: <strong>${producto.precioOferta.toFixed(2)}</strong>
                  </p>
                  <p className="text-muted">Estado: {producto.estado}</p>
                  <hr />
                  <p>{producto.descripcion}</p>
                </div>

                <div className="mt-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="category-button w-100"
                    onClick={handleAddToCart} // Llamamos a la nueva función
                  >
                    <CartFill className="me-2" /> Añadir al Carrito
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetalleProducto;
