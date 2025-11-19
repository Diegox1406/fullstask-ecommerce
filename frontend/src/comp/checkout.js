import React from "react";
import Pago from "./pago";
import ResumenCompra from "./resumenCompra";

const itemsCarrito = [
  { id: 1, name: "iPhone 13 Pro", price: 3899, qty: 1, image: "https://placehold.co/60x60" },
  { id: 2, name: "Case Premium", price: 49, qty: 1, image: "https://placehold.co/60x60" }
];

const Checkout = () => {
  return (
    <div className="container py-4">
      <div className="row">

        {/* Formulario */}
        <div className="col-md-8">
          <Pago />
        </div>

        {/* Resumen */}
        <div className="col-md-4">
          <ResumenCompra items={itemsCarrito} />
        </div>

      </div>
    </div>
  );
};

export default Checkout;
