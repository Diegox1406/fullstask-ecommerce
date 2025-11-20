import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function AdminRoute() {
    // Obtenemos el estado de autenticación del contexto
    const { isAuthenticated, isAdmin, loading } = useAuth();
    
    // Muestra un cargador mientras se verifica la autenticación inicial
    if (loading) {
        return (
            <div style={{ 
                paddingTop: "100px", 
                textAlign: "center", 
                minHeight: "50vh", 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
            }}>
                <h2>Cargando estado de autenticación...</h2>
            </div>
        );
    }

    // 1. Si NO está autenticado, redirige a /login
    if (!isAuthenticated) {
        // Redirige al login para iniciar sesión
        return <Navigate to="/login" replace />; 
    }

    // 2. Si está autenticado pero NO es administrador, redirige a la página principal
    if (!isAdmin) {
        // Redirige al inicio (o a una página de acceso denegado)
        return <Navigate to="/" replace />; 
    }

    // 3. Si está autenticado Y es administrador, permite el renderizado de la ruta anidada
    // Outlet renderiza el componente que se definió como hijo de esta ruta (ej. AdminDashboard)
    return <Outlet />;
}