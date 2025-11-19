import React from "react";
import Carrusel from "./carrusel";
import Novedades from "./novedades";
import NuestrosProductos from "./nuestrosproductos";
import Promociones from "./promociones";
import Muestras from "./muestras";

// Este componente contiene todo el contenido que conforma la página de inicio
const Home = () => {
  return (
    // Agregamos el div para el padding que compensa la barra de navegación fija
    <div style={{ paddingTop: "0px" }}>
      {/* Contenido principal estático */}
      <h1>Iphone Key</h1>
      <p>Venta de Celulares</p>

      {/* Componentes de la página de inicio */}
      <Carrusel />
      <NuestrosProductos />
      <Novedades />
      <Muestras />

      <Promociones />
    </div>
  );
};

export default Home;
