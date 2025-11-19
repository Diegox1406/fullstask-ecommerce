import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../services/api";

export default function ProductsManagement() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Accesorio",
        condicion: "Nuevo",
        stock: "",
        estado: true,
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        // Datos de prueba ampliados
        setProducts([
            { _id: "1", name: "iPhone 14 Pro Max", category: "Oferta", price: 1199, stock: 15, estado: true, condicion: "Nuevo" },
            { _id: "2", name: "AirPods Pro 2", category: "Accesorio", price: 249, stock: 30, estado: true, condicion: "Nuevo" },
            { _id: "3", name: "Cable Lightning", category: "Accesorio", price: 19, stock: 100, estado: true, condicion: "Nuevo" },
            { _id: "4", name: "iPhone 13", category: "Oferta", price: 799, stock: 8, estado: false, condicion: "Reacondicionado" },
            { _id: "5", name: "MagSafe Charger", category: "Accesorio", price: 39, stock: 50, estado: true, condicion: "Nuevo" },
        ]);
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await request("/api/products");
            setProducts(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditMode(true);
            setCurrentProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                condicion: product.condicion,
                stock: product.stock,
                estado: product.estado,
            });
        } else {
            setEditMode(false);
            setCurrentProduct(null);
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "Accesorio",
                condicion: "Nuevo",
                stock: "",
                estado: true,
            });
        }
        setImageFile(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });
        if (imageFile) formDataToSend.append("image", imageFile);

        try {
            if (editMode && currentProduct) {
                await request(`/api/admin/products/${currentProduct._id}`, {
                    method: "PUT",
                    body: formDataToSend,
                    headers: {}, // No set Content-Type for FormData
                });
            } else {
                await request("/api/admin/products", {
                    method: "POST",
                    body: formDataToSend,
                    headers: {},
                });
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await request(`/api/admin/products/${id}`, { method: "DELETE" });
            fetchProducts();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Productos</h4>
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
                <table className="table table-hover mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td><strong>{product.name}</strong></td>
                                <td>{product.category}</td>
                                <td>${product.price}</td>
                                <td>
                                    <span
                                        className={`badge ${product.estado ? "bg-success" : "bg-secondary"
                                            }`}
                                    >
                                        {product.estado ? "Habilitado" : "Deshabilitado"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleOpenModal(product)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(product._id)}
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
                        {editMode ? "Editar Producto" : "Agregar Producto"}
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
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({ ...formData, price: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({ ...formData, category: e.target.value })
                                }
                            >
                                <option value="Accesorio">Accesorio</option>
                                <option value="Promocion">Promoción</option>
                                <option value="Oferta">Oferta</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) =>
                                    setFormData({ ...formData, stock: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
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
