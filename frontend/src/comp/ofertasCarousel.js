import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const offerProducts = [
  { id: 1, name: "iPhone 13 Pro", price: 799.99, oldPrice: 999.99, image: "https://placehold.co/400x300/a3e1f5/000?text=iPhone+13" },
  { id: 2, name: "AirPods Pro 2", price: 175, oldPrice: 249, image: "https://placehold.co/400x300/f5a3e1/000?text=AirPods" },
  { id: 3, name: "Cargador 20W", price: 19.99, oldPrice: 29.99, image: "https://placehold.co/400x300/e1f5a3/000?text=Cargador" },
  { id: 4, name: "Case Silicona", price: 9.99, oldPrice: 15, image: "https://placehold.co/400x300/a3f5a3/000?text=Case" },
  { id: 5, name: "Apple Watch SE", price: 199.99, oldPrice: 299.99, image: "https://placehold.co/400x300/f5e1a3/000?text=Watch" },
];

const OfertasCarousel = () => {
  const [index, setIndex] = useState(0);
  const itemsPerSlide = 3;

  const nextSlide = () => {
    setIndex(prev => (prev + 1) % offerProducts.length);
  };

  const prevSlide = () => {
    setIndex(prev => (prev === 0 ? offerProducts.length - 1 : prev - 1));
  };

  // Crear lista circular de productos
  const visibleProducts = [];
  for (let i = 0; i < itemsPerSlide; i++) {
    visibleProducts.push(offerProducts[(index + i) % offerProducts.length]);
  }

  return (
    <div className="position-relative mt-4 mb-5">

      <div style={{ display: "flex", gap: "15px", overflow: "hidden", width: "100%" }}>
        {visibleProducts.map(product => (
          <Link to={`/producto/${product.id}`} key={product.id} className="text-decoration-none" style={{ flex: "1" }}>
            <Card className="h-100 text-center shadow-sm border-0">
              <Card.Img src={product.image} style={{ height: "200px", objectFit: "cover" }} />
              <Card.Body>
                <Card.Title className="fw-bold">{product.name}</Card.Title>
                <p className="text-danger text-decoration-line-through mb-0">S/ {product.oldPrice}</p>
                <p className="text-success fw-bold fs-5 mb-2">S/ {product.price}</p>
                <Button variant="warning" className="w-100">Agregar</Button>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>

      {/* Flecha izquierda */}
      <Button 
        variant="light"
        className="position-absolute top-50 start-0 translate-middle-y shadow-sm"
        style={{ borderRadius: "50%", width: "40px", height: "40px" }}
        onClick={prevSlide}
      >
        ❮
      </Button>

      {/* Flecha derecha */}
      <Button 
        variant="light"
        className="position-absolute top-50 end-0 translate-middle-y shadow-sm"
        style={{ borderRadius: "50%", width: "40px", height: "40px" }}
        onClick={nextSlide}
      >
        ❯
      </Button>

    </div>
  );
};

export default OfertasCarousel;
