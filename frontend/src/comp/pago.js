import React, { useState } from "react";
import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Pago = ({ finalTotal, formatCurrency }) => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        email: user?.email || '',
        name: user?.name || '',
        lastName: '',
        address: '',
        reference: '',
        district: '',
        zip: '',
        phone: '',
    });
    const [submissionMessage, setSubmissionMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputStyle = {
        backgroundColor: "#fedf9f",
        border: "1px solid #e4c677",
        borderRadius: "8px",
        padding: "10px"
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSimulatePayment = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (cartItems.length === 0) {
            setSubmissionMessage({ type: "warning", text: "El pedido fue cancelado. Por favor, agregue productos para realizar una nueva compra." });
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setSubmissionMessage(null);

        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            setSubmissionMessage({
                type: 'success',
                text: `¡Su compra ha sido procesada con éxito! Total final: ${formatCurrency(finalTotal)}.`,
                orderId: Math.floor(Math.random() * 1000000)
            });

            setTimeout(() => {
                clearCart();
                navigate('/', { replace: true });
            }, 5000);

        } catch (error) {
            setSubmissionMessage({ type: 'danger', text: 'Error en el procesamiento del pago. Inténtalo de nuevo.' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: "900px" }}>
            <h3 className="mb-4">Checkout</h3>

            {submissionMessage && (
                <Alert
                    variant={submissionMessage.type}
                    className="text-center p-3 mb-4"
                    style={submissionMessage.type === 'success' ? { backgroundColor: '#d4edda', borderColor: '#c3e6cb' } : {}}
                >
                    <p className="mb-1 fw-bold fs-5">
                        {submissionMessage.type === "success" ? "¡COMPRA FINALIZADA CON ÉXITO! 🎉" : submissionMessage.text}
                    </p>
                    {submissionMessage.orderId && <p className="mt-1 mb-0 text-small">Tu número de pedido es: <strong>#{submissionMessage.orderId}</strong></p>}
                    <p className="text-muted mt-2 mb-0">
                        {submissionMessage.type === 'success' ? 'Serás redirigido automáticamente al inicio en 5 segundos.' : 'Corrige el error para continuar.'}
                    </p>
                </Alert>
            )}

            {(!submissionMessage || submissionMessage.type === 'danger' || submissionMessage.type === 'warning') && (
                <Form onSubmit={handleSimulatePayment}>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between">
                            <h5>Contacto</h5>
                            {!isAuthenticated && <Link to="/login">Iniciar sesión</Link>}
                            {isAuthenticated && <span className="text-success fw-bold">Sesión iniciada: {user.email}</span>}
                        </div>
                        <Form.Control
                            type="email"
                            placeholder="Correo electrónico"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mb-2"
                            style={inputStyle}
                            disabled={isAuthenticated}
                        />
                        <Form.Check type="checkbox" label="Suscribirse para recibir ofertas" />
                    </div>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between">
                            <h5>Entrega</h5>
                            <span>Método de envío</span>
                        </div>
                        <Form.Select className="mb-2" style={inputStyle} disabled={isSubmitting}>
                            <option>Envío a domicilio</option>
                            <option>Recojo en tienda</option>
                        </Form.Select>

                        <Row className="mb-2">
                            <Col><Form.Control placeholder="Nombre" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} disabled={isSubmitting} /></Col>
                            <Col><Form.Control placeholder="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} required style={inputStyle} disabled={isSubmitting} /></Col>
                        </Row>

                        <Form.Control placeholder="Dirección" name="address" value={formData.address} onChange={handleChange} required className="mb-2" style={inputStyle} disabled={isSubmitting} />

                        <Row className="mb-2">
                            <Col><Form.Control placeholder="Referencia" name="reference" value={formData.reference} onChange={handleChange} style={inputStyle} disabled={isSubmitting} /></Col>
                            <Col><Form.Control placeholder="Distrito" name="district" value={formData.district} onChange={handleChange} required style={inputStyle} disabled={isSubmitting} /></Col>
                            <Col><Form.Control placeholder="Código Postal" name="zip" value={formData.zip} onChange={handleChange} required style={inputStyle} disabled={isSubmitting} /></Col>
                        </Row>

                        <Form.Control placeholder="Celular" name="phone" value={formData.phone} onChange={handleChange} required className="mb-2" style={inputStyle} disabled={isSubmitting} />
                    </div>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between">
                            <h5>Método de pago</h5>
                        </div>
                        <Form.Check
                            type="radio"
                            name="paymentMethod"
                            id="paymentIzipay"
                            value="izipay"
                            label="Izipay | Tarjetas de Crédito y Débito | Cuotas sin interés con BBVA, Interbank y Diners"
                            defaultChecked
                            className="mb-2"
                            disabled={isSubmitting}
                        />
                        <Card className="p-3 mb-3" style={{ backgroundColor: "#fff3e0", borderRadius: "8px" }}>
                            <p style={{ margin: 0 }}>
                                Después de hacer clic en <strong>“Finalizar compra”</strong>, serás redirigido a Izipay | Tarjetas de Crédito y Débito | Cuotas sin interés con BBVA, Interbank y Diners para completar tu compra de forma segura.
                            </p>
                        </Card>
                        <Form.Check
                            type="radio"
                            name="paymentMethod"
                            id="paymentCash"
                            value="cash"
                            label="Pago contra entrega"
                            className="mb-4"
                            disabled={isSubmitting}
                        />
                    </div>

                    <Button
                        className="w-100"
                        variant="primary"
                        size="lg"
                        onClick={isAuthenticated ? undefined : handleSimulatePayment}
                        type={isAuthenticated ? 'submit' : 'button'}
                        style={{ backgroundColor: "#fedf9f", border: "none", color: "#000", fontWeight: 'bold' }}
                        disabled={isSubmitting || cartItems.length === 0}
                    >
                        {isSubmitting ? <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Procesando Pago...
                        </> : (isAuthenticated ? `FINALIZAR COMPRA y PAGAR ${formatCurrency(finalTotal)}` : "🔒 INICIAR SESIÓN PARA PAGAR")}
                    </Button>
                </Form>
            )}
        </div>
    );
};

export default Pago;
