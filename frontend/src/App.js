import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Importamos los elementos necesarios de React Router DOM
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

// Componentes de Layout
import EcommerceNavbar from "./comp/nav";
import Footer from "./comp/footer";

// Componentes de Páginas
import Home from "./comp/home"; // La página principal
import Ofertas from "./comp/ofertas"; // Lista de ofertas
import DetalleProducto from "./comp/DetalleProducto"; // Detalle del producto
import Carrito from "./comp/carrito"; // Carrito de compras
import Checkout from "./comp/checkout"; // checkout / pago
import Cotizaciones from "./comp/cotizaciones";
import Accesorios from "./comp/accesorios";
import Promociones from "./comp/promociones";

// NUEVOS IMPORTS: Login y Register
import Login from "./comp/login";
import Register from "./comp/register";

// Reemplazar el placeholder por el dashboard real
import AdminDashboard from "./comp/admin/AdminDashboard";

// Componentes Placeholder para las otras páginas (debes crear estos archivos en src/comp/)
const Contacto = () => (
  <h1 style={{ paddingTop: "100px", textAlign: "center" }}>Contacto Page</h1>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <EcommerceNavbar />
          <Routes>
            {/* Ruta para la página principal (URL = /) */}
            <Route path="/" element={<Home />} />

            {/* Rutas de autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Ruta temporal para el panel de administración */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Rutas de Contenido de la navegación */}
            <Route path="/ofertas" element={<Ofertas />} />
            <Route path="/promociones" element={<Promociones />} />
            <Route path="/accesorios" element={<Accesorios />} />
            <Route path="/cotizaciones" element={<Cotizaciones />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* RUTA DINÁMICA: Para el detalle de cualquier producto, usando el :id */}
            <Route path="/producto/:id" element={<DetalleProducto />} />

            {/* Ruta 404 para URLs no encontradas */}
            <Route
              path="*"
              element={
                <h1 style={{ paddingTop: "100px", textAlign: "center" }}>
                  404: Página no encontrada
                </h1>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
