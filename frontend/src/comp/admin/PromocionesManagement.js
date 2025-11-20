import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form, Alert, Image, ListGroup } from "react-bootstrap";
import { getAllProducts, getAllPromotions, createPromotion, updatePromotion, deletePromotion } from "../../services/api";

export default function PromocionesManagement() {
  const [promociones, setPromociones] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPromo, setCurrentPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissionError, setSubmissionError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [formData, setFormData] = useState({ name: "", description: "", products: [], promoPrice: "", originalPrice: 0, estado: true });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [promosData, productsData] = await Promise.all([getAllPromotions(), getAllProducts()]);
      setPromociones(promosData); setProducts(productsData);
    } catch (error) { console.error("Error al cargar datos:", error); }
    finally { setLoading(false); }
  };

  const calculateOriginalPrice = useMemo(() => {
    return products.filter(p => formData.products.includes(p._id)).reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  }, [formData.products, products]);

  const handleOpenModal = (promo = null) => {
    setSubmissionError(null); setImageFile(null);
    if (promo) {
      setEditMode(true); setCurrentPromo(promo);
      setFormData({ name: promo.name, description: promo.description, products: promo.products.map(p => p._id), promoPrice: promo.promoPrice, originalPrice: promo.originalPrice, estado: promo.estado });
      setCurrentImageUrl(promo.image?.url || "");
    } else {
      setEditMode(false); setCurrentPromo(null); setFormData({ name: "", description: "", products: [], promoPrice: "", originalPrice: 0, estado: true });
      setCurrentImageUrl("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => { setShowModal(false); setEditMode(false); setCurrentPromo(null); setSubmissionError(null); setImageFile(null); setCurrentImageUrl(""); };

  const handleCheckboxChange = e => {
    const productId = e.target.value; const isChecked = e.target.checked;
    setFormData(prev => ({ ...prev, products: isChecked ? [...prev.products, productId] : prev.products.filter(id => id !== productId) }));
  };

  const handleSubmit = async e => {
    e.preventDefault(); setSubmissionError(null);
    const dataToSend = { ...formData, originalPrice: Number(calculateOriginalPrice), promoPrice: Number(formData.promoPrice) };
    if (dataToSend.products.length < 1) { setSubmissionError("Debe seleccionar al menos un producto."); return; }
    if (dataToSend.promoPrice >= dataToSend.originalPrice) { setSubmissionError("El precio promocional debe ser menor al precio original."); return; }

    let finalPayload;
    if (imageFile) {
      const formDataToSend = new FormData();
      Object.keys(dataToSend).forEach(key => formDataToSend.append(key, key === "products" ? dataToSend[key].join(",") : key === "estado" ? dataToSend[key].toString() : dataToSend[key]));
      formDataToSend.append("image", imageFile); finalPayload = formDataToSend;
    } else if (editMode && currentPromo) {
      finalPayload = { ...dataToSend, products: dataToSend.products.join(","), estado: dataToSend.estado.toString() };
    } else { setSubmissionError("Debe seleccionar una imagen."); return; }

    try {
      if (editMode && currentPromo) await updatePromotion(currentPromo._id, finalPayload);
      else await createPromotion(finalPayload);
      fetchData(); handleCloseModal();
    } catch (error) { console.error("Error submit:", error); setSubmissionError(error.message || "Error al guardar la promoción."); }
  };

  const handleDelete = async id => {
    if (!window.confirm("¿Seguro que deseas eliminar esta promoción?")) return;
    try { await deletePromotion(id); fetchData(); } catch (error) { console.error("Error eliminar:", error); alert(error.message || "Error al eliminar la promoción."); }
  };

  if (loading) return <div className="text-center mt-5">Cargando datos de administración...</div>;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Gestión de Promociones (Combos)</h4>
        <Button style={{ backgroundColor: "#fedf9f", border: "none", color: "#000", borderRadius: "25px" }} onClick={() => handleOpenModal()}>AGREGAR NUEVO COMBO</Button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr><th>#</th><th>Nombre</th><th>Productos Incluidos</th><th>Precio Promo</th><th>Precio Original</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {promociones.map((promo, i) => (
              <tr key={promo._id}>
                <td>{i+1}</td>
                <td>{promo.name}</td>
                <td>{promo.products.map(p => p.name).join(", ")}</td>
                <td><span className="text-success fw-bold">${promo.promoPrice.toLocaleString()}</span></td>
                <td><span className="text-danger text-decoration-line-through">${promo.originalPrice.toLocaleString()}</span></td>
                <td><span className={`badge ${promo.estado ? "bg-success" : "bg-secondary"}`}>{promo.estado ? "Activa" : "Inactiva"}</span></td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleOpenModal(promo)}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(promo._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Editar Promoción" : "Agregar Promoción"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submissionError && <Alert variant="danger">{submissionError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Nombre</Form.Label><Form.Control type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Descripción</Form.Label><Form.Control as="textarea" rows={3} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Imagen del Combo ({editMode ? "Opcional" : "Requerido"})</Form.Label>
              {currentImageUrl && !imageFile && <div className="mb-2"><Image src={currentImageUrl} thumbnail style={{ maxWidth: "100px" }} /><span className="ms-2 text-muted">Imagen actual</span></div>}
              <Form.Control type="file" accept="image/*" required={!editMode || !currentImageUrl} onChange={e => setImageFile(e.target.files[0])} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Productos (selecciona múltiples)</Form.Label>
              <div className="border rounded p-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
                <ListGroup variant="flush">{products.map(p => <ListGroup.Item key={p._id} className="p-1"><Form.Check type="checkbox" id={`product-${p._id}`} label={`${p.name} - $${p.price.toLocaleString()}`} value={p._id} checked={formData.products.includes(p._id)} onChange={handleCheckboxChange} /></ListGroup.Item>)}</ListGroup>
              </div>
            </Form.Group>
            <Alert variant="info" className="p-2">Precio Original: <span className="fw-bold float-end">${calculateOriginalPrice.toLocaleString()}</span></Alert>
            <Form.Group className="mb-3"><Form.Label>Precio Promocional</Form.Label><Form.Control type="number" required min="0" step="0.01" value={formData.promoPrice} onChange={e => setFormData({ ...formData, promoPrice: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Check type="checkbox" label="Promoción Activa" checked={formData.estado} onChange={e => setFormData({ ...formData, estado: e.target.checked })} /></Form.Group>
            <Button type="submit" style={{ backgroundColor: "#fedf9f", border: "none", color: "#000", borderRadius: "25px" }} className="w-100 mt-3">{editMode ? "Actualizar Promoción" : "Crear Promoción"}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
