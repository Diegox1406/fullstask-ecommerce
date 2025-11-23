import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getPromotions } from "../services/api";

// Importación de estilos nuevos
import "../comp/styles/Promocionespage.css";

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
            } catch (err) {
                setError("No se pudieron cargar las promociones. Inténtalo más tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchPromotions();
    }, []);

    if (loading)
        return (
            <Container style={{ paddingTop: "100px", minHeight: "50vh" }} className="text-center">
                <h2>Cargando promociones...</h2>
                <div className="spinner-border text-primary" role="status"></div>
            </Container>
        );

    if (error)
        return (
            <Container style={{ paddingTop: "100px", minHeight: "50vh" }} className="text-center">
                <div className="alert alert-danger">{error}</div>
            </Container>
        );

    if (promotions.length === 0)
        return (
            <Container style={{ paddingTop: "100px", minHeight: "50vh" }} className="text-center">
                <div className="alert alert-info">Actualmente no hay promociones disponibles.</div>
            </Container>
        );

    const formatPrice = (price) =>
        price ? price.toLocaleString("es-CL", { minimumFractionDigits: 0 }) : "N/A";

    return (
        <Container className="mb-5" style={{ paddingTop: "90px" }}>
            <Row className="mb-4">
                <Col className="text-center">
                    <h1 className="display-4 fw-bold">Promociones</h1>
                </Col>
            </Row>

            <Row xs={1} md={2} lg={3} className="g-4">
                {promotions.map((promo) => (
                    <Col key={promo._id}>
                        <Link
                            to={`/promocion/${promo._id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <Card className="promos-card">

                                <Card.Img
                                    variant="top"
                                    className="promos-img"
                                    src={
                                        promo.image?.url ??
                                        "https://placehold.co/600x400/F0F0F0/000000?text=COMBO+PROMO"
                                    }
                                    alt={promo.name}
                                />

                                <Card.Body className="promos-body">
                                    <Card.Title className="promos-title">{promo.name}</Card.Title>

                                    <p className="promos-regular">
                                        Precio Regular: $
                                        {promo.originalPrice
                                            ? formatPrice(promo.originalPrice)
                                            : "N/A"}
                                    </p>

                                    <p className="promos-oferta">
                                        OFERTA: $
                                        {promo.promoPrice
                                            ? formatPrice(promo.promoPrice)
                                            : "Precio no disponible"}
                                    </p>

                                    <Button className="promos-btn">
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
