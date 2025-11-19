import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../services/api";

export default function PromocionesManagement() {
    const [promociones, setPromociones] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPromo, setCurrentPromo] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        products: [],
        promoPrice: "",
        estado: true,
    });

    useEffect(() => {
        fetchPromociones();
        fetchProducts();
    }, []);

    const fetchPromociones = async () => {
        try {
            const data = await request("/api/promotions");
            setPromociones(data);
        } catch (error) {
            console.error("Error al cargar promociones:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await request("/api/products");
            setProducts(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };

    const handleOpenModal = (promo = null) => {
        if (promo) {
            setEditMode(true);
            setCurrentPromo(promo);
            setFormData({
                name: promo.name,
                description: promo.description,
                products: promo.products.map((p) => p._id),
                promoPrice: promo.promoPrice,
                estado: promo.estado,
            });
        } else {
            setEditMode(false);
            setCurrentPromo(null);
            setFormData({
                name: "",
                description: "",
                products: [],
                promoPrice: "",
                estado: true,
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentPromo(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode && currentPromo) {
                await request(`/api/promotions/${currentPromo._id}`, {
                    method: "PUT",
                    body: JSON.stringify(formData),
                });
            } else {
                await request("/api/promotions", {
                    method: "POST",
                    body: JSON.stringify(formData),
                });
            }
            fetchPromociones();
            handleCloseModal();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta promoción?")) return;
        try {
            await request(`/api/promotions/${id}`, { method: "DELETE" });
            fetchPromociones();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Promociones</h4>
                <Button
                    style={{
                        backgroundColor: "#fedf9f",
                        border: "none",
                        color: "#000",
                        borderRadius: "25px",
                    }}
                    onClick={() => handleOpenModal()}
                >
                    AGREGAR NUEVO
                </Button>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Precio Promo</th>
                            <th>Precio Original</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promociones.map((promo, index) => (
                            <tr key={promo._id}>
                                <td>{index + 1}</td>
                                <td>{promo.name}</td>
                                <td>${promo.promoPrice}</td>
                                <td>${promo.originalPrice}</td>
                                <td>
                                    <span
                                        className={`badge ${promo.estado ? "bg-success" : "bg-secondary"
                                            }`}
                                    >
                                        {promo.estado ? "Activa" : "Inactiva"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleOpenModal(promo)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(promo._id)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editMode ? "Editar Promoción" : "Agregar Promoción"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                required
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Productos (selecciona múltiples)</Form.Label>
                            <Form.Select
                                multiple
                                value={formData.products}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        products: Array.from(
                                            e.target.selectedOptions,
                                            (option) => option.value
                                        ),
                                    })
                                }
                            >
                                {products.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.name} - ${product.price}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio Promocional</Form.Label>
                            <Form.Control
                                type="number"
                                required
                                value={formData.promoPrice}
                                onChange={(e) =>
                                    setFormData({ ...formData, promoPrice: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            style={{
                                backgroundColor: "#fedf9f",
                                border: "none",
                                color: "#000",
                                borderRadius: "25px",
                            }}
                            className="w-100"
                        >
                            {editMode ? "Actualizar" : "Crear"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
