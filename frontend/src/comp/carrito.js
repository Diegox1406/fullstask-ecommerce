import React, { useMemo } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import OfertasCarousel from "./ofertasCarousel";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const TAX_RATE = 0.15;

const Carrito = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { cartItems, removeItem, updateQuantity } = useCart();

    const { subtotal, tax, total } = useMemo(() => {
        const subtotal = cartItems.reduce(
            (sum, item) => sum + (Number(item.promoPrice || item.price) * (item.quantity || 1)),
            0
        );
        const tax = subtotal * TAX_RATE;
        return { subtotal, tax, total: subtotal + tax };
    }, [cartItems]);

    const formatCurrency = amount => `S/ ${amount.toLocaleString("es-CL", { minimumFractionDigits: 2 })}`;

    const handleCheckoutClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    return (
        <Container className="mt-5 pt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">REVISA TU PEDIDO</h2>
                <Link to="/ofertas" style={{ textDecoration: "none", fontWeight: "500", color: "#007bff" }}>
                    Seguir Comprando
                </Link>
            </div>
            <br />
            <Row className="fw-bold border-bottom pb-2 mb-3 text-center">
                <Col md={4}>PRODUCTO</Col>
                <Col md={4}>CANTIDAD</Col>
                <Col md={4}>TOTAL</Col>
            </Row>

            {cartItems.length === 0 ? (
                <h4>Tu carrito está vacío</h4>
            ) : cartItems.map((item, index) => {
                const itemPrice = Number(item.promoPrice || item.price);
                const itemTotal = itemPrice * (item.quantity || 1);
                const imageUrl = item.image?.url || item.image || item.imagenUrl || "https://placehold.co/130x130/f9dba4/333333?text=IMG";

                return (
                    <Row key={item._id || index} className="py-4 border-bottom align-items-center">
                        <Col md={4} className="d-flex">
                            <Image
                                src={imageUrl}
                                style={{ width: "130px", height: "130px", borderRadius: "15px", objectFit: "cover", background: "#f9dba4" }}
                                onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/130x130/f9dba4/333333?text=IMG"; }}
                            />
                            <div className="ms-3">
                                <div style={{ fontSize: "12px", fontWeight: "600" }}>{item.isPromotion ? "COMBO PROMO" : "PRODUCTO"}</div>
                                <div style={{ fontSize: "28px", fontWeight: "800", lineHeight: "1" }}>{item.name || item.nombre}</div>
                                <div style={{ fontSize: "13px", fontWeight: "600", marginTop: "4px" }}>PRECIO UNITARIO: {formatCurrency(itemPrice)}</div>
                                <p style={{ fontSize: "12px", marginTop: "4px", maxWidth: "260px" }}>{item.description || item.descripcion || "Sin descripción detallada."}</p>
                            </div>
                        </Col>
                        <Col md={4} className="text-center">
                            <div className="d-inline-flex align-items-center px-3 py-2" style={{ background: "#f9dba4", borderRadius: "25px", fontSize: "18px", fontWeight: "600" }}>
                                <span style={{ cursor: "pointer" }} onClick={() => updateQuantity(item._id, -1, item.isPromotion)}>−</span>
                                <span className="mx-3">{item.quantity || 1}</span>
                                <span style={{ cursor: "pointer" }} onClick={() => updateQuantity(item._id, +1, item.isPromotion)}>+</span>
                            </div>
                            <br />
                            <Button variant="link" className="mt-2 p-0" style={{ color: "#007BFF" }} onClick={() => removeItem(item._id, item.isPromotion)}>Eliminar</Button>
                        </Col>
                        <Col md={4} className="text-center">
                            <div style={{ fontWeight: "800", fontSize: "24px" }}>{formatCurrency(itemTotal)}</div>
                        </Col>
                    </Row>
                );
            })}

            {cartItems.length > 0 && (
                <Row className="mt-4 pt-4 border-top">
                    <Col md={{ span: 4, offset: 8 }} className="text-end">
                        <div className="mb-2"><span className="text-muted">Subtotal:</span><span className="fw-bold ms-2">{formatCurrency(subtotal)}</span></div>
                        <div className="mb-2"><span className="text-muted">Impuestos ({TAX_RATE * 100}%):</span><span className="fw-bold ms-2">{formatCurrency(tax)}</span></div>
                        <h4 className="fw-bolder text-success">Total a Pagar: {formatCurrency(total)}</h4>
                        <Button
                            variant="warning"
                            className="w-100 mt-3"
                            style={{ backgroundColor: "#fedf9f", border: "none", color: "#000" }}
                            onClick={handleCheckoutClick}
                        >
                            {isAuthenticated ? 'Ir al Pago' : 'Iniciar Sesión para Pagar'}
                        </Button>
                    </Col>
                </Row>
            )}

            {cartItems.length > 0 && (
                <>
                    <h2 className="mt-5 mb-3 text-center">AGRÉGALO A TU PEDIDO</h2>
                    <OfertasCarousel />
                </>
            )}
        </Container>
    );
};

export default Carrito;
