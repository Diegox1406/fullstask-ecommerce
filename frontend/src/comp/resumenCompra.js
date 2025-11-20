import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';

// Tasa de impuesto (debe coincidir con Checkout.js)
const TAX_RATE = 0.15; 

// Componente funcional que recibe los datos como props
const ResumenCompra = ({ cartItems, subtotal, tax, finalTotal, formatCurrency }) => {

    if (!cartItems || cartItems.length === 0) {
        return (
            <Card className="shadow-sm" style={{ borderRadius: "12px", backgroundColor: "#fedf9f" }}>
                <h5 className="mb-3">Resumen de compra</h5>
                <p>No hay ítems en el carrito.</p>
            </Card>
        );
    }
    
    // El envío es fijo a 0 (Gratis)
    const envio = 0;

    return (
        <Card className="p-3 shadow-sm" style={{ borderRadius: "12px", backgroundColor: "#fedf9f" }}>
            <h5 className="mb-3">Resumen de compra</h5>

            {/* Mapeo de ítems del carrito */}
            {cartItems.map((item, index) => {
                const itemPrice = Number(item.promoPrice || item.price);
                const itemTotal = itemPrice * (item.quantity || 1);
                
                // 🛑 CORRECCIÓN CRÍTICA: Busca la URL de forma segura
                const imageUrl = item.image?.url || "https://placehold.co/60x60/cccccc/333333?text=IMG";

                return (
                    <div key={item._id || index} className="d-flex align-items-center mb-2">
                        <img 
                            src={imageUrl} 
                            alt={item.name} 
                            width="60" 
                            height="60" 
                            className="me-2 rounded" 
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/60x60/cccccc/333333?text=IMG"; }}
                        />
                        <div className="flex-grow-1">
                            <p className="m-0 fw-bold">{item.name}</p>
                            <small>Cant: {item.quantity || 1}</small>
                        </div>
                        <span className="fw-bold">{formatCurrency(itemTotal)}</span>
                    </div>
                );
            })}

            {/* Formulario de Descuento (Mantenido del original) */}
            <Form.Control placeholder="Código de descuento" className="mt-3 mb-2" />
            <Button variant="primary" size="sm" style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}>Aplicar</Button>

            <hr />

            {/* Totales */}
            <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="d-flex justify-content-between">
                <span>Envío</span>
                <strong className="text-success">{envio === 0 ? "Gratis" : formatCurrency(envio)}</strong>
            </div>
             <div className="d-flex justify-content-between">
                <span>Impuestos ({TAX_RATE * 100}%)</span>
                <strong>{formatCurrency(tax)}</strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between fs-5 fw-bold">
                <span>Total</span>
                <span>{formatCurrency(finalTotal)}</span>
            </div>
        </Card>
    );
};

export default ResumenCompra;