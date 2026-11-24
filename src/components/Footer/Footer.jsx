import { Link } from "react-router";
import Marca from "../Marca/Marca.jsx";
import { usePreferencias } from "../../hooks/usePreferencias.js";
import { interpolar } from "../../utils/formato.js";
import { textosFaltantes } from "../../config/textosFaltantes.js";
import "./Footer.css";

/**
 * Pie de página (Figma: «Pie de página»). Alcance de tres sprints: columnas
 * Explora, Tu cuenta y Legal. Todos los textos salen de textos.footer.
 */
export default function Footer() {
  const { idioma, textos, abrirAvisoCookies } = usePreferencias();
  const t = textos?.footer;
  const columnas = t?.columnas;

  return (
    <footer className="pie-home">
      <div className="ancho-home">
        <div className="columnas-pie">
          <div className="contenido-marca-pie">
            <Marca
              nombre={textos?.navbar?.logo?.texto}
              etiqueta={textos?.navbar?.logo?.aria}
              inverso
            />
            <p>{t?.lema}</p>
          </div>

          <nav
            className="grupo-enlaces-pie"
            aria-label={columnas?.explora?.titulo}
          >
            <h3>{columnas?.explora?.titulo}</h3>
            <Link to="/">{columnas?.explora?.enlaces?.inicio}</Link>
            <Link to="/explorar">{columnas?.explora?.enlaces?.explorar}</Link>
          </nav>

          <nav
            className="grupo-enlaces-pie"
            aria-label={columnas?.cuenta?.titulo}
          >
            <h3>{columnas?.cuenta?.titulo}</h3>
            <Link to="/ingresar">{columnas?.cuenta?.enlaces?.ingresar}</Link>
            <Link to="/registro">{columnas?.cuenta?.enlaces?.crearCuenta}</Link>
          </nav>

          <nav
            className="grupo-enlaces-pie"
            aria-label={columnas?.legal?.titulo}
          >
            <h3>{columnas?.legal?.titulo}</h3>
            <Link to="/terminos">{columnas?.legal?.enlaces?.terminos}</Link>
            <Link to="/accesibilidad">
              {columnas?.legal?.enlaces?.accesibilidad}
            </Link>
            {/* US-TAQ-S1-10: reabre el aviso de cookies sin recargar */}
            <button
              type="button"
              className="enlace-pie"
              onClick={abrirAvisoCookies}
            >
              {textosFaltantes[idioma]?.configurarCookies}
            </button>
          </nav>
        </div>

        <div className="pie-creditos">
          <span>
            {interpolar(t?.legal?.derechos, { anio: new Date().getFullYear() })}
          </span>
          <span>{t?.legal?.nota}</span>
        </div>
      </div>
    </footer>
  );
}
