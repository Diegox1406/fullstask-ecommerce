import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom"; // Para enlazar al detalle del producto
import { getAccessories } from "../services/api"; // Importar la función de la API
import "./styles/Accesorios.css";

function Accesorios() {
    const [accesorios, setAccesorios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccessories = async () => {
            try {
                // Llama a la API para obtener los productos de la categoría 'Accesorio'
                const data = await getAccessories();
                setAccesorios(data);
                setError(null);
            } catch (err) {
                console.error("Error al cargar accesorios:", err);
                setError("No se pudieron cargar los accesorios. Por favor, inténtalo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchAccessories();
    }, []);

    // ------------------------------------
    // Lógica de carga y error en la UI
    // ------------------------------------
    if (loading) {
        return (
            <Container style={{ paddingTop: "100px", minHeight: "50vh" }}>
                <h2 className="text-center">Cargando accesorios...</h2>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ paddingTop: "100px", minHeight: "50vh" }}>
                <div className="alert alert-danger text-center">
                    {error}
                </div>
            </Container>
        );
    }

    if (accesorios.length === 0) {
        return (
            <Container style={{ paddingTop: "100px", minHeight: "50vh" }}>
                <div className="alert alert-info text-center">
                    No encontramos accesorios disponibles en este momento.
                </div>
            </Container>
        );
    }
    // ------------------------------------

    return (
        <Container className="accesorios-container" style={{ paddingTop: "90px" }}>
            <Row className="mb-4">
                <Col className="text-center">
                    <h1 className="display-4 fw-bold">Accesorios</h1>
                    <p className="lead text-muted">
                        Explora nuestra colección de accesorios para mejorar tu experiencia
                        móvil.
                    </p>
                </Col>
            </Row>

            <Row xs={1} md={2} lg={3} className="g-4">
                {accesorios.map((item) => (
                    <Col key={item._id}>
                        {/* Enlazamos al detalle del producto */}
                        <Link to={`/producto/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Card className="accesorio-card shadow-sm border-0 h-100">
                                <div className="image-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                                    <Card.Img
                                        variant="top"
                                        // Asumimos que la imagen se llama 'image' o está anidada en 'image.url'
                                        src={item.image?.url || item.image || "https://placehold.co/400x250/F0F0F0/000000?text=SIN+IMAGEN"}
                                        alt={item.name}
                                        className="accesorio-image"
                                        style={{ objectFit: 'cover', height: '100%' }}
                                    />
                                </div>
                                <Card.Body className="accesorio-body text-center d-flex flex-column">
                                    <Card.Title className="fw-semibold mb-1">{item.name}</Card.Title>
                                    <Card.Text className="text-muted mb-3" style={{ flexGrow: 1 }}>
                                        {item.description ? item.description.substring(0, 50) + '...' : 'Sin descripción.'}
                                    </Card.Text>
                                    <Card.Text className="text-primary fw-bold fs-5">
                                        ${item.price ? item.price.toLocaleString('es-CL', { minimumFractionDigits: 0 }) : 'N/A'}
                                    </Card.Text>
                                    <Button
                                        variant="warning"
                                        style={{ backgroundColor: "#fedf9f", border: "none", color: "#000" }}
                                        className="mt-2"
                                    >
                                        Ver Producto
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

export default Accesorios;