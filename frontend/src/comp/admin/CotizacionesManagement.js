import React, { useState, useEffect } from "react";
import request from "../../services/api";

export default function CotizacionesManagement() {
    const [cotizaciones, setCotizaciones] = useState([]);

    useEffect(() => {
        fetchCotizaciones();
    }, []);

    const fetchCotizaciones = async () => {
        try {
            const data = await request("/api/cotizaciones");
            setCotizaciones(data);
        } catch (error) {
            console.error("Error al cargar cotizaciones:", error);
        }
    };

    return (
        <div>
            <h4 className="mb-3">Cotizaciones</h4>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th>Almacenamiento</th>
                            <th>Estado</th>
                            <th>Email</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cotizaciones.map((cot, index) => (
                            <tr key={cot._id}>
                                <td>{index + 1}</td>
                                <td>{cot.marca}</td>
                                <td>{cot.modelo}</td>
                                <td>{cot.año}</td>
                                <td>{cot.almacenamiento}</td>
                                <td>{cot.estado}</td>
                                <td>{cot.email}</td>
                                <td>{new Date(cot.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
