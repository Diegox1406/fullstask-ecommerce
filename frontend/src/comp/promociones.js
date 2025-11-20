import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getPromotions } from "../services/api";

function Promociones() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const data = await getPromotions();
                setPromotions(data);
                setError(null);
                console.log("Datos de Promociones recibidos:", data);
                if (data.length > 0) console.log("Estructura del primer objeto de Promoción:", data[0]);
            } catch (err) {
                console.error("Error al cargar promociones:", err);
                setError("No se pudieron cargar las promociones. Inténtalo más tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchPromotions();
    }, []);

    if (loading) return (
        <Container style={{ paddingTop: "100px", minHeight: "50vh" }} className="text-center">
            <h2>Cargando promociones...</h2>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </Container>
    );

    if (error) return (
        <Container style={{ paddingTop: "100px", minHeight: "50vh" }} className="text-center">
            <div className="alert alert-danger">{error}</div>
        </Container>
    );

    if (promotions.length === 0) return (
        <Container style={{ paddingTop: "100px", minHeight: "50vh" }} className="text-center">
            <div className="alert alert-info">Actualmente no hay promociones disponibles.</div>
        </Container>
    );

    const formatPrice = price => price ? price.toLocaleString('es-CL', { minimumFractionDigits: 0 }) : 'N/A';

    return (
        <Container style={{ paddingTop: "90px" }}>
            <Row className="mb-4">
                <Col className="text-center">
                    <h1 className="display-4 fw-bold">Promociones</h1>
                </Col>
            </Row>
            <Row xs={1} md={2} lg={3} className="g-4">
                {promotions.map(promo => (
                    <Col key={promo._id}>
                        <Link to={`/promocion/${promo._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Card className="novedades-card shadow-sm h-100 transition-shadow">
                                <Card.Img
                                    variant="top"
                                    src={promo.image?.url || "https://placehold.co/400x300/F0F0F0/000000?text=COMBO+PROMO"}
                                    alt={promo.name || 'Promoción'}
                                    className="novedades-image"
                                    style={{ objectFit: 'cover', height: '250px' }}
                                />
                                <Card.Body className="novedades-body d-flex flex-column">
                                    <Card.Title className="fw-bold mb-1">{promo.name}</Card.Title>
                                    <Card.Text className="text-danger text-decoration-line-through mb-0" style={{ fontSize: '0.9rem' }}>
                                        Precio Regular: ${promo.originalPrice ? formatPrice(promo.originalPrice) : 'N/A'}
                                    </Card.Text>
                                    <Card.Text className="text-success fw-bold fs-5 mt-auto">
                                        OFERTA: ${promo.promoPrice ? formatPrice(promo.promoPrice) : 'Precio no disponible'}
                                    </Card.Text>
                                    <Button
                                        variant="warning"
                                        style={{ backgroundColor: "#fedf9f", border: "none", color: "#000" }}
                                        className="w-100 mt-2"
                                    >
                                        Ver Combo
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Promociones;
