
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
  const { idioma, cambiarIdioma, textos } = usePreferencias();

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

  const textoSaltar =
    textos?.general?.aria?.saltarAlContenido ??
    interfaz[idioma]?.saltar ??
    interfaz.es.saltar;

  return (
    <div className={`landing ${proyecto.id}`}>
      <SaltarContenido texto={textoSaltar} />

      <Navbar
        nombre={proyecto.nombre}
        tipo={proyecto.id}
        idioma={idioma}
        textos={textos}
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
        onCerrar={cerrarCookies}
      />
    </div>
  );
}
