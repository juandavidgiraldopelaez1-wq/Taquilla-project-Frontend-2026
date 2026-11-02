
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import "./PanelAccesibilidad.css";

export default function PanelAccesibilidad({
  abierto,
  onCerrar,
  idioma,
}) {
  const {
    accesibilidad,
    ajustarTamanoTexto,
    cambiarOpcionAccesibilidad,
    restablecerAccesibilidad,
    errorAccesibilidad,
  } = usePreferencias();

  if (!abierto) return null;

  const en = idioma === "en";

  const opciones = [
    {
      id: "altoContraste",
      titulo: en ? "High contrast" : "Alto contraste",
      descripcion: en
        ? "More contrast between text and background"
        : "Más diferencia entre el texto y el fondo",
    },
    {
      id: "reducirMovimiento",
      titulo: en ? "Reduce motion" : "Reducir movimiento",
      descripcion: en
        ? "No animations or transitions"
        : "Sin animaciones ni transiciones",
    },
    {
      id: "subrayarEnlaces",
      titulo: en ? "Underline links" : "Subrayar enlaces",
      descripcion: en
        ? "Links are distinguishable without relying on color"
        : "Los enlaces se distinguen sin depender del color",
    },
    {
      id: "espaciadoLectura",
      titulo: en ? "Reading spacing" : "Espaciado de lectura",
      descripcion: en
        ? "More space between lines and letters"
        : "Más espacio entre líneas y entre letras",
    },
  ];

  return (
    <aside
      id="panel-accesibilidad"
      className="panel-accesibilidad"
      role="dialog"
      aria-modal="false"
      aria-labelledby="titulo-accesibilidad"
    >
      <header className="panel-accesibilidad-encabezado">
        <h2 id="titulo-accesibilidad">
          {en ? "Accessibility" : "Accesibilidad"}
        </h2>

        <button
          type="button"
          className="panel-accesibilidad-cerrar"
          onClick={onCerrar}
          aria-label={
            en
              ? "Close accessibility panel"
              : "Cerrar panel de accesibilidad"
          }
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M15 5L10 10M10 10L5 15M10 10L5 5M10 10L15 15"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#141414"
            />
          </svg>
        </button>
      </header>

      <section className="panel-accesibilidad-tamano">
        <h3>{en ? "Text size" : "Tamaño del texto"}</h3>

        <div className="control-tamano-texto">
          <button
            type="button"
            onClick={() => ajustarTamanoTexto(-1)}
            disabled={accesibilidad.tamanoTexto <= 80}
            aria-label={
              en ? "Decrease text size" : "Disminuir tamaño del texto"
            }
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
                fill="#141414"
              />
            </svg>
          </button>

          <output
            aria-live="polite"
            aria-label={
              en
                ? `Text size ${accesibilidad.tamanoTexto}%`
                : `Tamaño del texto ${accesibilidad.tamanoTexto}%`
            }
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
                fill="#141414"
              />
            </svg>
          </output>

          <button
            type="button"
            onClick={() => ajustarTamanoTexto(1)}
            disabled={accesibilidad.tamanoTexto >= 150}
            aria-label={
              en ? "Increase text size" : "Aumentar tamaño del texto"
            }
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
                fill="#141414"
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
                onClick={() =>
                  cambiarOpcionAccesibilidad(opcion.id, !activa)
                }
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
          {errorAccesibilidad
            ? en
              ? "Preferences could not be saved on this device."
              : "No se pudieron guardar las preferencias en este dispositivo."
            : en
              ? "Your preferences are saved on this device. Initial values come from what you have already defined in your system."
              : "Se guarda en este dispositivo. Los valores iniciales salen de lo que ya definiste en tu sistema."}
        </p>

        <footer>
          <a href="#declaracion-accesibilidad">
            {en
              ? "Accessibility statement"
              : "Declaración de accesibilidad"}
          </a>

          <button
            type="button"
            className="panel-accesibilidad-restablecer"
            onClick={restablecerAccesibilidad}
          >
            {en ? "Reset" : "Restablecer"}
          </button>
        </footer>
      </div>
    </aside>
  );
}
