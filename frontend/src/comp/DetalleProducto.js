import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Alert, Card } from 'react-bootstrap';
import { CartFill } from 'react-bootstrap-icons';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

const DetalleProducto = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar el producto:", err);
        setError("No se pudo cargar la información del producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (price) => price ? price.toLocaleString('es-CL',{minimumFractionDigits:0}):'N/A';
  const isOnOffer = product && product.oferta === true && product.precioOferta > 0;
  const displayPrice = isOnOffer ? product?.precioOferta : product?.price;
  const originalPrice = product?.price;

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    const priceToUse = isOnOffer ? product.precioOferta : product.price;
    const itemToAdd = { ...product, _id: product._id, price: priceToUse, isPromotion: false };
    addItem(itemToAdd);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  if (loading) return <Container className="mt-5 pt-5 mb-5 text-center" style={{ minHeight:'50vh' }}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div></Container>;
  if (error || !product) return <Container className="mt-5 pt-5 mb-5" style={{ minHeight:'50vh' }}><Alert variant="danger" className="text-center">{error || "El producto solicitado no existe o no está disponible."}</Alert></Container>;

  return (
    <Container className="mt-5 pt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {showConfirmation && <Alert variant="success" dismissible onClose={() => setShowConfirmation(false)} className="mt-3">¡<strong>{product.name}</strong> añadido al carrito!</Alert>}
          <Card className="shadow-lg border-0">
            <Row className="g-0">
              <Col md={6}>
                <Image src={product.image?.url || product.image || "https://placehold.co/800x600/cccccc/333333?text=IMAGEN+NO+DISPONIBLE"} alt={product.name} fluid rounded onError={(e)=>{e.target.onerror=null;e.target.src="https://placehold.co/800x600/cccccc/333333?text=IMAGEN+NO+DISPONIBLE"}}/>
              </Col>
              <Col md={6} className="p-4 d-flex flex-column justify-content-between">
                <div>
                  <h1 className="display-6">{product.name}</h1>
                  <p className="lead my-3">{isOnOffer && <span className="text-decoration-line-through text-danger me-3 fs-5">${formatPrice(originalPrice)}</span>}<span className={`fw-bold fs-4 ${isOnOffer?'text-success':'text-primary'}`}>${formatPrice(displayPrice)}</span></p>
                  <p className="text-muted">Estado: {product.condicion}</p>
                  <p className={`fw-bold ${product.stock>0?'text-success':'text-danger'}`}>Disponibilidad: {product.stock>0?`${product.stock} en stock`:'Agotado'}</p>
                  <hr />
                  <p>{product.description}</p>
                </div>
                <div className="mt-4">
                  <Button variant="warning" size="lg" className="category-button w-100" style={{backgroundColor:"#fedf9f", border:"none", color:"#000"}} onClick={handleAddToCart} disabled={product.stock<=0}>
                    <CartFill className="me-2"/>{product.stock>0?'Añadir al Carrito':'Agotado'}
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
