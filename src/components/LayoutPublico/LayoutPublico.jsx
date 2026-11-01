import { useRef, useState } from "react";
import { proyecto } from "../../config/proyecto.js";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import { interfaz } from "../../data/interfaz.js";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import SaltarContenido from "../SaltarContenido/SaltarContenido.jsx";
import GestorCookies from "../GestorCookies/GestorCookies.jsx";
import "./LayoutPublico.css";
export default function LayoutPublico({
  destino,
  etiqueta,
  descripcion,
  onCuenta,
  children,
}) {
  const { idioma, cambiarIdioma } = usePreferencias();
  const [cookiesAbiertas, setCookiesAbiertas] = useState(false);
  const disparador = useRef(null);
  function abrirCookies() {
    disparador.current = document.activeElement;
    setCookiesAbiertas(true);
  }
  function cerrarCookies() {
    setCookiesAbiertas(false);
    disparador.current?.focus();
  }
  return (
    <div className={`landing ${proyecto.id}`}>
      <SaltarContenido texto={interfaz[idioma].saltar} />
      <Navbar
        nombre={proyecto.nombre}
        tipo={proyecto.id}
        idioma={idioma}
        onCambiarIdioma={cambiarIdioma}
        destino={destino}
        etiqueta={etiqueta}
        onCuenta={onCuenta}
      />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <Footer
        nombre={proyecto.nombre}
        tipo={proyecto.id}
        idioma={idioma}
        descripcion={descripcion}
        destino={destino}
        etiqueta={etiqueta}
        onCuenta={onCuenta}
        onAbrirCookies={abrirCookies}
      />
      <GestorCookies
        abierto={cookiesAbiertas}
        onAbrir={abrirCookies}
        onCerrar={cerrarCookies}
      />
    </div>
  );
}
