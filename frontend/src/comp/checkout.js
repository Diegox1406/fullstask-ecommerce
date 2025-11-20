import React, { useMemo } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Aunque no se usa directamente, se mantiene la importación si es necesaria
import Pago from "./pago";
import ResumenCompra from "./resumenCompra"; // Asumimos que ResumenCompra existe y usa props

const TAX_RATE = 0.15; // Tasa de impuesto (15%)

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems } = useCart(); 

    // Cálculo de totales
    const { subtotal, tax, total: finalTotal } = useMemo(() => {
        const sub = cartItems.reduce((sum, item) => sum + (Number(item.promoPrice || item.price) * (item.quantity || 1)), 0);
        const tx = sub * TAX_RATE;
        return { subtotal: sub, tax: tx, total: sub + tx };
    }, [cartItems]);
    
    const formatCurrency = amount => `S/ ${amount.toLocaleString("es-CL", { minimumFractionDigits: 2 })}`;

    // Manejo de carrito vacío
    if (cartItems.length === 0) {
        return (
            <Container className="mt-5 pt-5 mb-5 text-center" style={{ minHeight: '60vh' }}>
                <Alert variant="info">Tu carrito está vacío. <Button variant="link" onClick={() => navigate('/ofertas')}>Ir a Ofertas</Button></Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5 pt-5 mb-5">
            <h2 className="text-center mb-4">FINALIZAR PEDIDO Y PAGO</h2>
            
            <Row>
                {/* Columna 1: FORMULARIO DE PAGO (PAGO.JS) */}
                <Col md={8}>
                    {/* 🛑 Pasamos los props necesarios al Pago.js */}
                    <Pago 
                        finalTotal={finalTotal}
                        formatCurrency={formatCurrency}
                    />
                </Col>

                {/* Columna 2: RESUMEN DE COMPRA (RESUMENCOMPRA.JS) */}
                <Col md={4}>
                    {/* Asumimos que ResumenCompra existe y utiliza props */}
                    <ResumenCompra 
                        cartItems={cartItems}
                        subtotal={subtotal}
                        tax={tax}
                        finalTotal={finalTotal}
                        formatCurrency={formatCurrency}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Checkout;