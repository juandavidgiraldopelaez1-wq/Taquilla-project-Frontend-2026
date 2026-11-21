import { usePreferencias } from "../../hooks/usePreferencias.js";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import SaltarContenido from "../SaltarContenido/SaltarContenido.jsx";
import GestorCookies from "../GestorCookies/GestorCookies.jsx";
import "./LayoutPublico.css";

/**
 * Estructura común de las vistas: enlace para saltar al contenido,
 * encabezado, <main>, pie y aviso de cookies.
 * `titulo` y `descripcion` son los metadatos de la página: React 19 lleva
 * <title> y <meta> al <head> (equivalente a generateMetadata de Next.js).
 */
export default function LayoutPublico({ titulo, descripcion, children }) {
  const { textos } = usePreferencias();

  return (
    <div className="landing taquilla">
      {titulo && <title>{titulo}</title>}
      {descripcion && <meta name="description" content={descripcion} />}

      <SaltarContenido texto={textos?.general?.aria?.saltarAlContenido} />
      <Navbar />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <GestorCookies />
    </div>
  );
}
