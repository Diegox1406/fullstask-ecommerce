import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import ProductsManagement from "./ProductsManagement";
import CotizacionesManagement from "./CotizacionesManagement";
import PromocionesManagement from "./PromocionesManagement";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState("productos");

    // TEMPORAL: Comentar esta protección para ver el diseño sin backend
    // Descomentar cuando conectes el backend y tengas usuarios admin reales
    // if (!user || !user.isAdmin) {
    //     return <Navigate to="/" replace />;
    // }

    const renderSection = () => {
        switch (activeSection) {
            case "productos":
                return <ProductsManagement />;
            case "cotizaciones":
                return <CotizacionesManagement />;
            case "promociones":
                return <PromocionesManagement />;
            default:
                return <ProductsManagement />;
        }
    };

    return (
        <div className="admin-dashboard" style={{ paddingTop: "80px", minHeight: "100vh" }}>
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-2 bg-dark text-white p-0" style={{ minHeight: "100vh" }}>
                        <div className="sidebar">
                            <div className="p-3 border-bottom">
                                <h5 className="mb-0">INVENTARIO & COTIZACIONES</h5>
                            </div>
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link text-white w-100 text-start ${activeSection === "productos" ? "active bg-primary" : ""
                                            }`}
                                        onClick={() => setActiveSection("productos")}
                                    >
                                        Productos
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link text-white w-100 text-start ${activeSection === "cotizaciones" ? "active bg-primary" : ""
                                            }`}
                                        onClick={() => setActiveSection("cotizaciones")}
                                    >
                                        Cotizaciones
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link text-white w-100 text-start ${activeSection === "promociones" ? "active bg-primary" : ""
                                            }`}
                                        onClick={() => setActiveSection("promociones")}
                                    >
                                        Promociones
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="col-md-10 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="text-muted mb-0">
                                Hola {user?.name || "Administrador (Vista Previa)"}
                            </h6>
                            <span className="badge bg-warning text-dark">🔓 Modo Preview</span>
                        </div>
                        {renderSection()}
                    </div>
                </div>
            </div>
        </div>
    );
}
