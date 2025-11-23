import React, { useState, useMemo, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CartFill } from 'react-bootstrap-icons';
import { getAllProducts } from '../services/api';
import { useCart } from '../context/CartContext';

const OfertasCarousel = () => {
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const { addItem } = useCart();
  const itemsPerSlide = 3;

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await getAllProducts();
        const activeProducts = data.filter(p => p.estado === true);
        setOfferProducts(activeProducts);
      } catch (error) {
        console.error("Error al cargar productos para el carrusel:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const priceToUse = product.oferta && product.precioOferta > 0 ? product.precioOferta : product.price;
    const itemToAdd = { ...product, _id: product._id, price: priceToUse, isPromotion: false };
    addItem(itemToAdd);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const nextSlide = () => {
    if (offerProducts.length > itemsPerSlide) setIndex(prev => (prev + 1) % offerProducts.length);
  };
  const prevSlide = () => {
    if (offerProducts.length > itemsPerSlide) setIndex(prev => (prev === 0 ? offerProducts.length - 1 : prev - 1));
  };

  const visibleProducts = useMemo(() => {
    if (loading || offerProducts.length === 0) return [];
    if (offerProducts.length < itemsPerSlide) return offerProducts;
    const list = [];
    for (let i = 0; i < itemsPerSlide; i++) list.push(offerProducts[(index + i) % offerProducts.length]);
    return list;
  }, [offerProducts, index, loading]);

  if (loading) return <div className="text-center text-muted">Cargando sugerencias...</div>;
  if (offerProducts.length === 0) return <div className="text-center text-muted">No hay productos disponibles para recomendar.</div>;

  const formatPrice = price => price ? price.toLocaleString('es-CL', { minimumFractionDigits: 0 }) : 'N/A';

  return (
    <div className="position-relative mt-4 mb-5">
      {showAlert && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setShowAlert(false)}
          style={{ position: 'fixed', top: 80, right: 20, zIndex: 1050, minWidth: '250px' }}
        >
          ✅ ¡Producto añadido al carrito!
        </Alert>
      )}

      <div
        style={{
          display: "flex",
          gap: "15px",
          overflow: "hidden",
          width: "100%",
          justifyContent: "center",
          flexWrap: "nowrap"
        }}
      >
        {visibleProducts.map(product => {
          const hasOffer = product.oferta === true && product.precioOferta > 0;
          const displayPrice = hasOffer ? product.precioOferta : product.price;
          const imageUrl = product.image?.url || product.image || "https://placehold.co/400x300/a3e1f5/000?text=IMG";

          return (
            <Link
              to={`/producto/${product._id}`}
              key={product._id}
              className="text-decoration-none"
              style={{ flex: "0 0 30%", minWidth: "200px" }}
            >
              <Card className="shadow-sm border-0" style={{ height: "350px", display: "flex", flexDirection: "column" }}>
                {/* Contenedor de imagen */}
                <div style={{
                  width: "100%",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  overflow: "hidden",
                  flexShrink: 0
                }}>
                  <Card.Img
                    src={imageUrl}
                    style={{
                      maxHeight: "100%",
                      width: "auto",
                      objectFit: "contain"
                    }}
                  />
                </div>

                {/* Cuerpo de la card */}
                <Card.Body style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <Card.Title
                      className="fw-bold"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal"
                      }}
                      title={product.name}
                    >
                      {product.name}
                    </Card.Title>

                    {/* Mostrar solo el precio que corresponde */}
                    <p className="text-success fw-bold fs-5 mb-2">S/ {formatPrice(displayPrice)}</p>
                  </div>
                  <Button variant="warning" className="w-100 mt-auto" onClick={(e) => handleAddToCart(product, e)}>
                    <CartFill className="me-2"/> Agregar
                  </Button>
                </Card.Body>
              </Card>
            </Link>
          );
        })}
      </div>

      <Button
        variant="light"
        className="position-absolute top-50 start-0 translate-middle-y shadow-sm"
        style={{ borderRadius: "50%", width: "40px", height: "40px", left: '-15px' }}
        onClick={prevSlide}
      >
        ❮
      </Button>
      <Button
        variant="light"
        className="position-absolute top-50 end-0 translate-middle-y shadow-sm"
        style={{ borderRadius: "50%", width: "40px", height: "40px", right: '-15px' }}
        onClick={nextSlide}
      >
        ❯
      </Button>
    </div>
  );
};

export default OfertasCarousel;
