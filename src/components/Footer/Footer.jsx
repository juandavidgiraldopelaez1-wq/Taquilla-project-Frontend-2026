
import Marca from "../Marca/Marca.jsx";
import { interfaz } from "../../data/interfaz.js";
import "./Footer.css";

export default function Footer({
  nombre,
  tipo,
  descripcion,
  destino,
  onCuenta,
  idioma,
  onAbrirCookies,
}) {
  const t = interfaz[idioma];

  return (
    <footer className="pie-home">
      <div className="ancho-home">

        <div className="columnas-pie">

          {/* Marca y descripción */}
          <div className="contenido-marca-pie">
            <Marca nombre={nombre} tipo={tipo} />

            <p>
              {descripcion} {t.descripcionFooterExtra}
            </p>
          </div>

          {/* Columna Explora */}
          <nav
            className="grupo-enlaces-pie"
            aria-label={t.explora}
          >
            <h3>{t.explora}</h3>

            <a href="#contenido">
              {t.inicio}
            </a>

            <a href={destino}>
              {t.explorarEventos}
            </a>
          </nav>

          {/* Columna Tu cuenta */}
          <nav
            className="grupo-enlaces-pie"
            aria-label={t.cuenta}
          >
            <h3>{t.cuenta}</h3>

            <button
              type="button"
              onClick={() => onCuenta("ingresar")}
            >
              {t.ingresar}
            </button>

            <button
              type="button"
              onClick={() => onCuenta("registro")}
            >
              {t.registro}
            </button>
          </nav>

          {/* Columna Legal */}
          <nav
            className="grupo-enlaces-pie"
            aria-label={t.legal}
          >
            <h3>{t.legal}</h3>

            <a href="#contenido">
              {t.terminos}
            </a>

            <a href="#contenido">
              {t.accesibilidad}
            </a>
          </nav>

        </div>

        {/* Créditos inferiores */}
        <div className="pie-creditos">

          <span>
            © 2026 {nombre} · {t.academico}
          </span>

          <div className="creditos-derecha">

            <span>
              {t.avisoAcademico}
            </span>

            <button
              type="button"
              className="preferencias-pie"
              onClick={onAbrirCookies}
            >
              {t.cookies}
            </button>

          </div>
        </div>

      </div>
    </footer>
  );
}
