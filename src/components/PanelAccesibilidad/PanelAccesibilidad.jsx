import { usePreferencias } from "../../hooks/usePreferencias.js";
import "./PanelAccesibilidad.css";
import Icono from "../Icono/Icono.jsx";

export default function PanelAccesibilidad({ abierto, onCerrar }) {
  const {
    accesibilidad,
    ajustarTamanoTexto,
    cambiarOpcionAccesibilidad,
    restablecerAccesibilidad,
    errorAccesibilidad,
    textos,
  } = usePreferencias();

  if (!abierto) return null;

  // Textos: textos.accesibilidad de GET /textos.
  const t = textos?.accesibilidad;
  const opciones = [
    "altoContraste",
    "reducirMovimiento",
    "subrayarEnlaces",
    "espaciadoLectura",
  ].map((id) => ({
    id,
    titulo: t?.[id]?.nombre,
    descripcion: t?.[id]?.descripcion,
  }));

  return (
    <aside
      id="panel-accesibilidad"
      className="panel-accesibilidad"
      role="dialog"
      aria-modal="false"
      aria-labelledby="titulo-accesibilidad"
    >
      <header className="panel-accesibilidad-encabezado">
        <h2 id="titulo-accesibilidad">{t?.titulo}</h2>

        <button
          type="button"
          className="panel-accesibilidad-cerrar"
          onClick={onCerrar}
          aria-label={textos?.general?.aria?.cerrarDialogo}
        >
          <Icono nombre="cerrar" />
        </button>
      </header>

      <section className="panel-accesibilidad-tamano">
        <h3>{t?.tamanoTexto}</h3>

        <div className="control-tamano-texto">
          <button
            type="button"
            onClick={() => ajustarTamanoTexto(-1)}
            disabled={accesibilidad.tamanoTexto <= 80}
            aria-label={t?.aria?.disminuirTexto}
          >
            <svg
              width="9"
              height="2"
              viewBox="0 0 9 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M2.5034e-06 1.88035V0.000350952H8.76V1.88035H2.5034e-06Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <output
            aria-live="polite"
            aria-label={`${t?.tamanoTexto ?? ""} ${accesibilidad.tamanoTexto} %`}
          >
            <svg
              width="11"
              height="12"
              viewBox="0 0 11 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M-2.39015e-05 11.5195L4.33598 -0.000469208H5.80798L1.66398 11.5195H-2.39015e-05ZM8.91198 11.5195L4.76798 -0.000469208H6.31998L10.672 11.5195H8.91198ZM2.19198 6.92753H8.36798V8.33553H2.19198V6.92753Z"
                fill="currentColor"
              />
            </svg>
          </output>

          <button
            type="button"
            onClick={() => ajustarTamanoTexto(1)}
            disabled={accesibilidad.tamanoTexto >= 150}
            aria-label={t?.aria?.aumentarTexto}
          >
            <svg
              width="9"
              height="10"
              viewBox="0 0 9 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3.41994 9.25957V-0.000430584H5.37994V9.25957H3.41994ZM-5.85318e-05 5.57957V3.69957H8.75994V5.57957H-5.85318e-05Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </section>

      <section className="panel-accesibilidad-opciones">
        {opciones.map((opcion) => {
          const activa = accesibilidad[opcion.id];

          return (
            <div className="opcion-accesibilidad" key={opcion.id}>
              <div className="opcion-accesibilidad-texto">
                <h3>{opcion.titulo}</h3>
                <p>{opcion.descripcion}</p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={activa}
                aria-label={opcion.titulo}
                className="interruptor-accesibilidad"
                onClick={() => cambiarOpcionAccesibilidad(opcion.id, !activa)}
              >
                <svg
                  width="44"
                  height="24"
                  viewBox="0 0 44 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    width="44"
                    height="24"
                    rx="12"
                    fill={activa ? "#141414" : "#8C8C8C"}
                  />
                  <circle
                    cx={activa ? "32" : "12"}
                    cy="12"
                    r="9"
                    fill="#FFFFFF"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </section>

      <div className="panel-accesibilidad-pie">
        <p role={errorAccesibilidad ? "alert" : undefined}>
          {errorAccesibilidad ? textos?.errores?.generico : t?.nota}
        </p>

        <footer>
          <a href="#declaracion-accesibilidad">{t?.enlaces?.declaracion}</a>

          <button
            type="button"
            className="panel-accesibilidad-restablecer"
            onClick={restablecerAccesibilidad}
          >
            {t?.botones?.restablecer}
          </button>
        </footer>
      </div>
    </aside>
  );
}
