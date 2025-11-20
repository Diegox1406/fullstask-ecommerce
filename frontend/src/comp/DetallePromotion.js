import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Alert, Card, ListGroup } from 'react-bootstrap';
import { CartFill } from 'react-bootstrap-icons';
import { getPromotionById } from '../services/api';
import { useCart } from '../context/CartContext';

const DetallePromotion = () => {
  const { id } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const data = await getPromotionById(id);
        setPromotion(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar la promoción:", err);
        setError("No se pudo cargar la información de la promoción.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromotion();
  }, [id]);

  const formatPrice = price => price ? price.toLocaleString('es-CL',{minimumFractionDigits:0}) : 'N/A';

  const handleAddToCart = () => {
    if(!promotion) return;
    const itemToAdd = {
      _id: promotion._id,
      name: promotion.name,
      price: promotion.promoPrice,
      quantity: 1,
      isPromotion: true,
      products: promotion.products.map(p=>({id:p._id,name:p.name,price:p.price}))
    };
    addItem(itemToAdd);
    setShowConfirmation(true);
    setTimeout(()=>setShowConfirmation(false),3000);
  };

  if(loading) return <Container className="mt-5 pt-5 mb-5 text-center" style={{minHeight:'50vh'}}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div></Container>;
  if(error||!promotion) return <Container className="mt-5 pt-5 mb-5" style={{minHeight:'50vh'}}><Alert variant="danger" className="text-center">{error||"La promoción solicitada no existe o no está disponible."}</Alert></Container>;

  return (
    <Container className="mt-5 pt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {showConfirmation&&<Alert variant="success" onClose={()=>setShowConfirmation(false)} dismissible className="mt-3">¡<strong>{promotion.name}</strong> añadido al carrito!</Alert>}
          <Card className="shadow-lg border-0">
            <Row className="g-0">
              <Col md={6}><Image src={promotion.image?.url||"https://placehold.co/800x600/FFD700/000?text=COMBO+PROMO"} alt={promotion.name} fluid rounded/></Col>
              <Col md={6} className="p-4 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge bg-warning text-dark mb-2">PAQUETE PROMOCIONAL</span>
                  <h1 className="display-6">{promotion.name}</h1>
                  <p className="lead my-2"><span className="text-decoration-line-through text-danger me-3 fs-5">Regular: ${formatPrice(promotion.originalPrice)}</span><span className="fw-bold fs-3 text-success">¡Solo hoy!: ${formatPrice(promotion.promoPrice)}</span></p>
                  <hr/>
                  <p>{promotion.description}</p>
                  <h5 className="mt-4">Productos Incluidos:</h5>
                  <ListGroup variant="flush">{promotion.products.map(p=><ListGroup.Item key={p._id||p.id}>{p.name} <span className="float-end text-muted">(${formatPrice(p.price)})</span></ListGroup.Item>)}</ListGroup>
                </div>
                <div className="mt-4">
                  <Button variant="warning" size="lg" className="category-button w-100" style={{backgroundColor:"#fedf9f",border:"none",color:"#000"}} onClick={handleAddToCart}><CartFill className="me-2"/> Añadir Combo al Carrito</Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetallePromotion;
