import React, { useState, useEffect } from "react";
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
import { getAllCotizaciones } from "../services/api";
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
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cotizaciones from backend
  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        const data = await getAllCotizaciones();
        setCotizaciones(data);
      } catch (error) {
        console.error("Error fetching cotizaciones:", error);
        setCotizaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCotizaciones();
  }, []);

  // Get unique marcas from cotizaciones
  const marcasUnicas = [...new Set(cotizaciones.map((c) => c.marca))].filter(
    Boolean
  );

  // Get modelos by marca
  const getModelosPorMarca = (marca) => {
    return [
      ...new Set(
        cotizaciones.filter((c) => c.marca === marca).map((c) => c.modelo)
      ),
    ].filter(Boolean);
  };

  // Get años disponibles for selected modelo
  const getAñosPorModelo = (marca, modelo) => {
    return [
      ...new Set(
        cotizaciones
          .filter((c) => c.marca === marca && c.modelo === modelo)
          .map((c) => c.año)
      ),
    ]
      .filter(Boolean)
      .sort((a, b) => b - a); // Sort years descending (newest first)
  };

  // Get almacenamiento options for selected modelo and año
  const getAlmacenamientoPorModeloAño = (marca, modelo, año) => {
    return [
      ...new Set(
        cotizaciones
          .filter(
            (c) => c.marca === marca && c.modelo === modelo && c.año === año
          )
          .map((c) => c.almacenamiento)
      ),
    ].filter(Boolean);
  };

  // Get precioModelo for selected combination
  const getPrecioModelo = (marca, modelo, año, almacenamiento) => {
    const cotizacion = cotizaciones.find(
      (c) =>
        c.marca === marca &&
        c.modelo === modelo &&
        c.año === año &&
        c.almacenamiento === almacenamiento
    );
    return cotizacion ? cotizacion.precioModelo : null;
  };

  // Manejar cambios en el formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    if (name === "marca") {
      // Reset all dependent fields when marca changes
      setFormData({
        ...formData,
        marca: value,
        modelo: "",
        año: "",
        almacenamiento: "",
      });
    } else if (name === "modelo") {
      // Reset año and almacenamiento when modelo changes
      setFormData({
        ...formData,
        modelo: value,
        año: "",
        almacenamiento: "",
      });
    } else if (name === "año") {
      // Reset almacenamiento when año changes
      setFormData({
        ...formData,
        año: value,
        almacenamiento: "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Validar email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Calcular valoración usando precioModelo from database
  const calcularValoracion = async (e) => {
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
    setEnviando(true);

    try {
      // Get the base price from database
      const precioBase = getPrecioModelo(
        formData.marca,
        formData.modelo,
        formData.año,
        formData.almacenamiento
      );

      if (!precioBase) {
        throw new Error(
          "No se encontró precio base para la combinación seleccionada"
        );
      }

      // valuacion segun condicion
      const multiplicadoresEstado = {
        nuevo: 0.8, // 80% of base price for new
        excelente: 0.7, // 70% for excellent
        bueno: 0.6, // 60% for good
        regular: 0.4, // 40% for regular
        malo: 0.2, // 20% for bad
      };

      const multiplicador = multiplicadoresEstado[formData.estado] || 0.5;
      let valorFinal = Math.round(precioBase * multiplicador);

      // Round to nearest 10 for cleaner presentation
      valorFinal = Math.round(valorFinal / 10) * 10;

      setValoracion(valorFinal);
      setMostrarResultado(true);
    } catch (error) {
      console.error("Error calculando valoración:", error);
      alert("Error al calcular la valoración. Por favor intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  // Enviar email
  const enviarEmail = async () => {
    setEnviando(true);
    setErrorEmail("");

    try {
      const templateParams = {
        to_email: "maxmurillovargas@gmail.com",
        from_email: formData.email,
        marca: formData.marca,
        modelo: formData.modelo,
        año: formData.año,
        estado: formData.estado,
        almacenamiento: formData.almacenamiento,
        valoracion: `$${valoracion} USD`,
        user_email: formData.email,
        fecha: new Date().toLocaleDateString("es-ES"),
        dispositivo: `${formData.marca} ${formData.modelo}`,
        condicion: formData.estado,
        almacenamiento_gb: formData.almacenamiento,
      };

      await emailjs.send(
        "service_xdf85a8",
        "template_nk5eycd",
        templateParams,
        "3YwkB-C38_6efdthi"
      );

      const userTemplateParams = {
        to_email: formData.email, // User's email
        from_email: "maxmurillovargas@gmail.com", // Your business email
        marca: formData.marca,
        modelo: formData.modelo,
        año: formData.año,
        estado: formData.estado,
        almacenamiento: formData.almacenamiento,
        valoracion: `$${valoracion} USD`,
        user_email: formData.email,
        fecha: new Date().toLocaleDateString("es-ES"),
        dispositivo: `${formData.marca} ${formData.modelo}`,
        condicion: formData.estado,
        almacenamiento_gb: formData.almacenamiento,
      };

      await emailjs.send(
        "service_xdf85a8",
        "template_yukfbmq",
        userTemplateParams,
        "3YwkB-C38_6efdthi"
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

  if (loading) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="cotizaciones-card shadow">
              <Card.Body className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Cargando opciones...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

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
                    Esta es nuestra oferta por tu {formData.marca}{" "}
                    {formData.modelo} ({formData.año}) {formData.almacenamiento}
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
                      {marcasUnicas.map((marca) => (
                        <option key={marca} value={marca}>
                          {marca}
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
                        getModelosPorMarca(formData.marca).map((modelo) => (
                          <option key={modelo} value={modelo}>
                            {modelo}
                          </option>
                        ))}
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
                      disabled={!formData.modelo}
                      className="form-select-personalizado"
                      required
                    >
                      <option value="">Selecciona el año</option>
                      {formData.marca &&
                        formData.modelo &&
                        getAñosPorModelo(formData.marca, formData.modelo).map(
                          (año) => (
                            <option key={año} value={año}>
                              {año}
                            </option>
                          )
                        )}
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
                      disabled={!formData.año}
                      className="form-select-personalizado"
                      required
                    >
                      <option value="">Selecciona almacenamiento</option>
                      {formData.marca &&
                        formData.modelo &&
                        formData.año &&
                        getAlmacenamientoPorModeloAño(
                          formData.marca,
                          formData.modelo,
                          formData.año
                        ).map((almacenamiento) => (
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
                      disabled={enviando}
                    >
                      {enviando ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Calculando...
                        </>
                      ) : (
                        "Calcular Valoración"
                      )}
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
                  <li>Precio base según modelo, año y almacenamiento</li>
                  <li>Ajuste según estado físico del equipo</li>
                  <li>Valoraciones basadas en precios de mercado actuales</li>
                  <li>Ofertas competitivas y transparentes</li>
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
