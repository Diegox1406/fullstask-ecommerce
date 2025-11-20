import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../services/api";

export default function CotizacionesManagement() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCotizacion, setCurrentCotizacion] = useState(null);
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    año: "",
    almacenamiento: "",
    precioModelo: "",
    estado: true,
  });

  // Carga las cotizaciones al montar el componente
  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const fetchCotizaciones = async () => {
    try {
      // GET: Carga todas las cotizaciones
      const data = await request("/api/cotizaciones");
      setCotizaciones(data);
    } catch (error) {
      console.error("Error al cargar cotizaciones:", error);
    }
  };

  const handleOpenModal = (cotizacion = null) => {
    if (cotizacion) {
      setEditMode(true);
      setCurrentCotizacion(cotizacion);
      setFormData({
        marca: cotizacion.marca,
        modelo: cotizacion.modelo,
        año: cotizacion.año,
        almacenamiento: cotizacion.almacenamiento,
        precioModelo: cotizacion.precioModelo,
        estado: cotizacion.estado,
      });
    } else {
      setEditMode(false);
      setCurrentCotizacion(null);
      setFormData({
        marca: "",
        modelo: "",
        año: "",
        almacenamiento: "",
        precioModelo: "",
        estado: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentCotizacion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode && currentCotizacion) {
        // PUT: Actualiza la cotización existente
        await request(`/api/admin/cotizacion/${currentCotizacion._id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // POST: Crea una nueva cotización
        await request("/api/admin/cotizacion", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      fetchCotizaciones(); // Recarga la lista después de la operación
      handleCloseModal();
    } catch (error) {
      alert("Error al guardar cotización: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cotización?")) return;
    try {
      // DELETE: Elimina la cotización
      await request(`/api/admin/cotizacion/${id}`, { method: "DELETE" });
      fetchCotizaciones(); // Recarga la lista
    } catch (error) {
      alert("Error al eliminar cotización: " + error.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Cotizaciones</h4>
        <Button
          style={{
            backgroundColor: "#fedf9f",
            border: "none",
            color: "#000",
            borderRadius: "25px",
          }}
          onClick={() => handleOpenModal()}
        >
          AGREGAR NUEVA
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Almacenamiento</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.map((cotizacion, index) => (
              <tr key={cotizacion._id}>
                <td>{cotizacion._id}</td>
                <td>
                  <strong>{cotizacion.marca}</strong>
                </td>
                <td>{cotizacion.modelo}</td>
                <td>{cotizacion.año}</td>
                <td>{cotizacion.almacenamiento}</td>
                <td>${cotizacion.precioModelo?.toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${
                      cotizacion.estado ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {cotizacion.estado ? "Activa" : "Inactiva"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleOpenModal(cotizacion)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(cotizacion._id)}
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
            {editMode ? "Editar Cotización" : "Agregar Cotización"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.marca}
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Modelo</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.modelo}
                onChange={(e) =>
                  setFormData({ ...formData, modelo: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.año}
                onChange={(e) =>
                  setFormData({ ...formData, año: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Almacenamiento</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.almacenamiento}
                onChange={(e) =>
                  setFormData({ ...formData, almacenamiento: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio del Modelo</Form.Label>
              <Form.Control
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.precioModelo}
                onChange={(e) =>
                  setFormData({ ...formData, precioModelo: e.target.value })
                }
                placeholder="0.00"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Cotización Activa"
                checked={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.checked })
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
