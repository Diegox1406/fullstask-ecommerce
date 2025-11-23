import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Layout
import EcommerceNavbar from "./comp/nav";
import Footer from "./comp/footer";

// Páginas
import Home from "./comp/home";
import Ofertas from "./comp/ofertas";
import DetalleProducto from "./comp/DetalleProducto";
import DetallePromocion from "./comp/DetallePromotion";
import Carrito from "./comp/carrito";
import Checkout from "./comp/checkout";
import Cotizaciones from "./comp/cotizaciones";
import Accesorios from "./comp/accesorios";
import Promociones from "./comp/promociones";
import Contactanos from "./comp/contacto";
import SearchResults from "./comp/SearchResults";

// Login/Register
import Login from "./comp/login";
import Register from "./comp/register";

// Admin
import AdminDashboard from "./comp/admin/AdminDashboard";
import AdminRoute from "./comp/AdminRoute";

const Contacto = () => (
  <h1 style={{ paddingTop: "100px", textAlign: "center" }}>Contacto Page</h1>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <EcommerceNavbar />
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Navegación */}
              <Route path="/ofertas" element={<Ofertas />} />
              <Route path="/promociones" element={<Promociones />} />
              <Route path="/accesorios" element={<Accesorios />} />
              <Route path="/cotizaciones" element={<Cotizaciones />} />
              <Route path="/contacto" element={<Contactanos />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/search" element={<SearchResults />} />

              {/* Detalle dinámico */}
              <Route path="/promocion/:id" element={<DetallePromocion />} />
              <Route path="/producto/:id" element={<DetalleProducto />} />

              {/* 404 */}
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
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
