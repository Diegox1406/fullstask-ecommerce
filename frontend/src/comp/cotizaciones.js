import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import emailjs from "emailjs-com";
import "./styles/cotizaciones.css";

function Cotizaciones() {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    año: "",
    estado: "",
    almacenamiento: "",
    email: "",
  });

  const [valoracion, setValoracion] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");

  // Base de datos de teléfonos
  const baseDatosTelefonos = {
    apple: {
      marca: "Apple",
      modelos: [
        "iPhone 15",
        "iPhone 15 Pro",
        "iPhone 14",
        "iPhone 14 Pro",
        "iPhone 13",
        "iPhone 13 Pro",
        "iPhone 12",
        "iPhone 12 Pro",
        "iPhone 11",
        "iPhone SE",
      ],
      valoresBase: {
        "iPhone 15": 800,
        "iPhone 15 Pro": 950,
        "iPhone 14": 600,
        "iPhone 14 Pro": 750,
        "iPhone 13": 450,
        "iPhone 13 Pro": 550,
        "iPhone 12": 350,
        "iPhone 12 Pro": 400,
        "iPhone 11": 250,
        "iPhone SE": 200,
      },
    },
    samsung: {
      marca: "Samsung",
      modelos: [
        "Galaxy S23",
        "Galaxy S23 Ultra",
        "Galaxy S22",
        "Galaxy S22 Ultra",
        "Galaxy S21",
        "Galaxy S21 Ultra",
        "Galaxy Z Flip",
        "Galaxy Z Fold",
      ],
      valoresBase: {
        "Galaxy S23": 600,
        "Galaxy S23 Ultra": 800,
        "Galaxy S22": 450,
        "Galaxy S22 Ultra": 600,
        "Galaxy S21": 350,
        "Galaxy S21 Ultra": 450,
        "Galaxy Z Flip": 550,
        "Galaxy Z Fold": 900,
      },
    },
    xiaomi: {
      marca: "Xiaomi",
      modelos: [
        "Redmi Note 13",
        "Redmi Note 12",
        "Mi 13",
        "Mi 12",
        "Poco X6",
        "Poco F5",
      ],
      valoresBase: {
        "Redmi Note 13": 200,
        "Redmi Note 12": 150,
        "Mi 13": 350,
        "Mi 12": 280,
        "Poco X6": 180,
        "Poco F5": 220,
      },
    },
  };

  // Años disponibles
  const añoActual = new Date().getFullYear();
  const años = Array.from({ length: 6 }, (_, i) => añoActual - i);

  // Opciones de almacenamiento
  const opcionesAlmacenamiento = ["64GB", "128GB", "256GB", "512GB", "1TB"];

  // Manejar cambios en el formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reiniciar modelo si cambia la marca
    if (name === "marca") {
      setFormData((prev) => ({ ...prev, modelo: "" }));
    }
  };

  // Validar email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Calcular valoración
  const calcularValoracion = (e) => {
    e.preventDefault();

    if (
      !formData.marca ||
      !formData.modelo ||
      !formData.año ||
      !formData.estado ||
      !formData.almacenamiento ||
      !formData.email
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (!validarEmail(formData.email)) {
      setErrorEmail("Por favor ingresa un email válido");
      return;
    }

    setErrorEmail("");

    let valorBase =
      baseDatosTelefonos[formData.marca]?.valoresBase[formData.modelo] || 300;

    // Ajustar por año (depreciación)
    const diferenciaAños = añoActual - parseInt(formData.año);
    const multiplicadorAño = Math.max(0.5, 1 - diferenciaAños * 0.15);
    valorBase *= multiplicadorAño;

    // Ajustar por estado
    const multiplicadoresEstado = {
      nuevo: 1.0,
      excelente: 0.8,
      bueno: 0.6,
      regular: 0.4,
      malo: 0.2,
    };
    valorBase *= multiplicadoresEstado[formData.estado] || 0.5;

    // Ajustar por almacenamiento
    const multiplicadoresAlmacenamiento = {
      "64GB": 1.0,
      "128GB": 1.2,
      "256GB": 1.4,
      "512GB": 1.6,
      "1TB": 1.8,
    };
    valorBase *= multiplicadoresAlmacenamiento[formData.almacenamiento] || 1.0;

    // Redondear a la decena más cercana
    const valorFinal = Math.round(valorBase / 10) * 10;

    setValoracion(valorFinal);
    setMostrarResultado(true);
  };

  // Enviar email
  const enviarEmail = async () => {
    setEnviando(true);
    setErrorEmail("");

    try {
      // Configuración de EmailJS - DEBES CONFIGURAR ESTOS DATOS
      const templateParams = {
        to_email: "maxmurillovargas@gmail.com", // Cambia por tu email corporativo
        from_email: formData.email,
        marca: baseDatosTelefonos[formData.marca]?.marca || formData.marca,
        modelo: formData.modelo,
        año: formData.año,
        estado: formData.estado,
        almacenamiento: formData.almacenamiento,
        valoracion: `$${valoracion} USD`,
        user_email: formData.email,
        fecha: new Date().toLocaleDateString("es-ES"),
      };

      const templateParamsUsuario = {
        to_email: formData.email, // Email del usuario
        from_email: "maxmurillovargas@gmail.com", // Tu email corporativo como remitente
        marca: baseDatosTelefonos[formData.marca]?.marca || formData.marca,
        modelo: formData.modelo,
        año: formData.año,
        estado: formData.estado,
        almacenamiento: formData.almacenamiento,
        valoracion: `$${valoracion} USD`,
        user_email: formData.email,
        fecha: new Date().toLocaleDateString("es-ES"),
        tipo: "copia_usuario", // Para identificar en el template
      };

      // Envía el email usando EmailJS
      await emailjs.send(
        "service_xdf85a8", // Reemplaza con tu Service ID de EmailJS
        "template_nk5eycd", // Reemplaza con tu Template ID de EmailJS
        templateParams,
        "3YwkB-C38_6efdthi" // Reemplaza con tu Public Key de EmailJS
      );

      setEmailEnviado(true);
    } catch (error) {
      console.error("Error al enviar email:", error);
      setErrorEmail("Error al enviar el email. Por favor intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  // Reiniciar formulario
  const reiniciarFormulario = () => {
    setFormData({
      marca: "",
      modelo: "",
      año: "",
      estado: "",
      almacenamiento: "",
      email: "",
    });
    setMostrarResultado(false);
    setValoracion(null);
    setEmailEnviado(false);
    setErrorEmail("");
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="cotizaciones-card shadow">
            <Card.Header className="cotizaciones-header text-white">
              <h2 className="text-center mb-0">Cotiza tu Celular</h2>
              <p className="text-center mb-0">
                Recibe una valoración instantánea
              </p>
            </Card.Header>

            <Card.Body className="p-4">
              {mostrarResultado && valoracion ? (
                <Alert
                  variant="success"
                  className="text-center resultado-alert"
                >
                  <Alert.Heading>¡Valoración Calculada!</Alert.Heading>
                  <hr />
                  <h3 className="text-primary valor-final">
                    ${valoracion} USD
                  </h3>
                  <p className="mb-3">
                    Esta es nuestra oferta por tu{" "}
                    {baseDatosTelefonos[formData.marca]?.marca}{" "}
                    {formData.modelo}
                  </p>

                  {emailEnviado ? (
                    <Alert variant="success" className="mb-3">
                      ✅ Email enviado exitosamente. Nos pondremos en contacto
                      contigo.
                    </Alert>
                  ) : (
                    <div className="mb-3">
                      <p>¿Deseas que nos contactemos contigo?</p>
                      <Button
                        variant="primary"
                        className="boton-personalizado me-2"
                        onClick={enviarEmail}
                        disabled={enviando}
                      >
                        {enviando ? (
                          <>
                            <Spinner
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
                            Enviando...
                          </>
                        ) : (
                          "Enviar Cotización por Email"
                        )}
                      </Button>
                    </div>
                  )}

                  {errorEmail && (
                    <Alert variant="danger" className="mb-3">
                      {errorEmail}
                    </Alert>
                  )}

                  <Button
                    variant="outline-primary"
                    className="mt-2"
                    onClick={reiniciarFormulario}
                  >
                    Cotizar Otro Celular
                  </Button>
                </Alert>
              ) : (
                <Form onSubmit={calcularValoracion}>
                  {/* Campo Email */}
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Tu Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={manejarCambio}
                      placeholder="tu@email.com"
                      className="form-select-personalizado"
                      required
                    />
                    {errorEmail && (
                      <Form.Text className="text-danger">
                        {errorEmail}
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* Selección de Marca */}
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">
                      Marca del Celular
                    </Form.Label>
                    <Form.Select
                      name="marca"
                      value={formData.marca}
                      onChange={manejarCambio}
                      className="form-select-personalizado"
                      required
                    >
                      <option value="">Selecciona una marca</option>
                      {Object.keys(baseDatosTelefonos).map((marca) => (
                        <option key={marca} value={marca}>
                          {baseDatosTelefonos[marca].marca}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Selección de Modelo */}
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Modelo</Form.Label>
                    <Form.Select
                      name="modelo"
                      value={formData.modelo}
                      onChange={manejarCambio}
                      disabled={!formData.marca}
                      className="form-select-personalizado"
                      required
                    >
                      <option value="">Selecciona un modelo</option>
                      {formData.marca &&
                        baseDatosTelefonos[formData.marca]?.modelos.map(
                          (modelo) => (
                            <option key={modelo} value={modelo}>
                              {modelo}
                            </option>
                          )
                        )}
                    </Form.Select>
                  </Form.Group>

                  {/* Selección de Año */}
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">
                      Año de Fabricación
                    </Form.Label>
                    <Form.Select
                      name="año"
                      value={formData.año}
                      onChange={manejarCambio}
                      className="form-select-personalizado"
                      required
                    >
                      <option value="">Selecciona el año</option>
                      {años.map((año) => (
                        <option key={año} value={año}>
                          {año}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Selección de Almacenamiento */}
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">
                      Almacenamiento
                    </Form.Label>
                    <Form.Select
                      name="almacenamiento"
                      value={formData.almacenamiento}
                      onChange={manejarCambio}
                      className="form-select-personalizado"
                      required
                    >
                      <option value="">Selecciona almacenamiento</option>
                      {opcionesAlmacenamiento.map((almacenamiento) => (
                        <option key={almacenamiento} value={almacenamiento}>
                          {almacenamiento}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Selección de Estado */}
                  <Form.Group className="mb-4">
                    <Form.Label className="form-label">
                      Estado del Equipo
                    </Form.Label>
                    <Form.Select
                      name="estado"
                      value={formData.estado}
                      onChange={manejarCambio}
                      className="form-select-personalizado"
                      required
                    >
                      <option value="">Selecciona el estado</option>
                      <option value="nuevo">Nuevo en caja</option>
                      <option value="excelente">
                        Excelente - Pocos rasguños
                      </option>
                      <option value="bueno">Bueno - Algunos rasguños</option>
                      <option value="regular">Regular - Marcas visibles</option>
                      <option value="malo">
                        Malo - Pantalla rota/defectos
                      </option>
                    </Form.Select>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className="boton-personalizado"
                    >
                      Calcular Valoración
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>

          {/* Información Adicional */}
          {!mostrarResultado && (
            <Card className="mt-4 info-card">
              <Card.Body>
                <h5 className="info-titulo">¿Cómo calculamos tu valoración?</h5>
                <ul className="info-lista">
                  <li>Precios base según modelo y popularidad</li>
                  <li>Depreciación por antigüedad del equipo</li>
                  <li>Ajuste según estado físico</li>
                  <li>Valor adicional por mayor almacenamiento</li>
                </ul>
                <p className="text-muted mb-0 info-nota">
                  * Te enviaremos la cotización por email y nos pondremos en
                  contacto contigo.
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Cotizaciones;
