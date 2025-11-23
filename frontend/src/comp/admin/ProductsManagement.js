import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import request from "../../services/api";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Accesorio",
    condicion: "Nuevo",
    stock: "",
    estado: true,
    oferta: false,
    precioOferta: "",
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
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
    setSubmissionError(null);

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
        oferta: product.oferta || false,
        precioOferta: product.precioOferta || "",
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
        oferta: false,
        precioOferta: "",
      });
    }

    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentProduct(null);
    setSubmissionError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await request(`/api/admin/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      setSubmissionError("Error al eliminar producto: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(null);

    const currentPrice = Number(formData.price);
    const offerPrice = Number(formData.precioOferta);

    if (formData.oferta && (!formData.precioOferta || offerPrice <= 0)) {
      setSubmissionError("Debe ingresar un precio de oferta válido si la oferta está activa.");
      return;
    }

    if (formData.oferta && offerPrice >= currentPrice) {
      setSubmissionError("El precio de oferta debe ser menor al precio normal.");
      return;
    }

    if (!editMode && !imageFile) {
      setSubmissionError("Debe seleccionar una imagen para crear el producto.");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      let value = formData[key];
      if (typeof value === "boolean" || ["price", "stock", "precioOferta"].includes(key)) {
        value = String(value);
      }
      formDataToSend.append(key, value);
    });

    if (imageFile) formDataToSend.append("image", imageFile);

    try {
      if (editMode && currentProduct) {
        await request(`/api/admin/products/${currentProduct._id}`, {
          method: "PUT",
          body: formDataToSend,
        });
      } else {
        await request("/api/admin/products", {
          method: "POST",
          body: formDataToSend,
        });
      }

      fetchProducts();
      handleCloseModal();
    } catch (error) {
      setSubmissionError("Error al guardar producto: " + error.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Gestión de Productos</h4>
        <Button
          style={{ backgroundColor: "#fedf9f", border: "none", color: "#000", borderRadius: "25px" }}
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
              <th>Oferta</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id.slice(-4)}</td>
                <td><strong>{product.name}</strong></td>
                <td>{product.category}</td>
                <td>
                  {product.oferta ? (
                    <>
                      <span className="text-danger text-decoration-line-through me-1">
                        ${product.price.toLocaleString()}
                      </span>
                      <span className="text-success fw-bold">
                        ${product.precioOferta.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    `$${product.price.toLocaleString()}`
                  )}
                </td>

                <td>
                  <span className={`badge ${product.oferta ? "bg-info" : "bg-dark"}`}>
                    {product.oferta ? "Activa" : "No"}
                  </span>
                </td>

                <td>
                  <span className={`badge ${product.estado ? "bg-success" : "bg-secondary"}`}>
                    {product.estado ? "Habilitado" : "Deshabilitado"}
                  </span>
                </td>

                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleOpenModal(product)}>
                    ✏️
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product._id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Editar Producto" : "Agregar Producto"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {submissionError && <Alert variant="danger">{submissionError}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Accesorio">Accesorio</option>
                <option value="Smartphone">Smartphone</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Condición</Form.Label>
              <Form.Select
                value={formData.condicion}
                onChange={(e) => setFormData({ ...formData, condicion: e.target.value })}
              >
                <option value="Nuevo">Nuevo</option>
                <option value="Usado">Usado</option>
                <option value="Reacondicionado">Reacondicionado</option>
                <option value="Exhibicion">Exhibicion</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Producto Habilitado"
                checked={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Producto en Oferta"
                checked={formData.oferta}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    oferta: e.target.checked,
                    precioOferta: e.target.checked ? formData.precioOferta : "",
                  })
                }
              />
            </Form.Group>

            {formData.oferta && (
              <Form.Group className="mb-3">
                <Form.Label>Precio de Oferta</Form.Label>
                <Form.Control
                  type="number"
                  required={formData.oferta}
                  min="0"
                  step="0.01"
                  value={formData.precioOferta}
                  onChange={(e) => setFormData({ ...formData, precioOferta: e.target.value })}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
              className="w-100"
              style={{ backgroundColor: "#fedf9f", border: "none", color: "#000", borderRadius: "25px" }}
            >
              {editMode ? "Actualizar" : "Crear"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
