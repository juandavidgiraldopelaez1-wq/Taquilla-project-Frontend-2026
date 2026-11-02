
import { useId, useRef, useState } from "react";
import Marca from "../Marca/Marca.jsx";
import MenuMovil from "../MenuMovil/MenuMovil.jsx";
import SelectorIdioma from "../SelectorIdioma/SelectorIdioma.jsx";
import PanelAccesibilidad from "../PanelAccesibilidad/PanelAccesibilidad.jsx";
import { interfaz } from "../../data/interfaz.js";
import "./Navbar.css";

export default function Navbar({
  nombre,
  tipo,
  idioma,
  onCambiarIdioma,
  destino,
  etiqueta,
  onCuenta,
}) {
  const [abierto, setAbierto] = useState(false);
  const [accesibilidadAbierta, setAccesibilidadAbierta] = useState(false);

  const boton = useRef(null);
  const botonAccesibilidad = useRef(null);

  const id = useId();
  const t = interfaz[idioma];

  return (
    <header
      className="cabecera-home"
      onKeyDown={(evento) => {
        if (evento.key !== "Escape") return;

        if (accesibilidadAbierta) {
          setAccesibilidadAbierta(false);
          botonAccesibilidad.current?.focus();
          return;
        }

        if (abierto) {
          setAbierto(false);
          boton.current?.focus();
        }
      }}
    >
      <div className="ancho-home fila-cabecera">
        <Marca nombre={nombre} tipo={tipo} />

        <button
          className="ingreso-movil"
          onClick={() => onCuenta("ingresar")}
        >
          {t.ingresar}
        </button>

        <MenuMovil
          abierto={abierto}
          onAlternar={() => setAbierto(!abierto)}
          menuId={id}
          botonRef={boton}
          textos={t}
        />

        <nav
          id={id}
          className={`menu-home ${abierto ? "abierto" : ""}`}
          aria-label={t.navegacion}
        >
          <a
            href="#contenido"
            aria-current="page"
            onClick={() => setAbierto(false)}
          >
            {t.inicio}
          </a>

          <a href={destino} onClick={() => setAbierto(false)}>
            {etiqueta}
          </a>

          <div className="acciones-home">
            {tipo === "taquilla" && (
              <>
                <a
                  className="buscar-cabecera"
                  href="#buscador-eventos"
                  onClick={() => setAbierto(false)}
                >
                  {t.buscar}
                </a>

                <div className="accesibilidad-home">
                  <button
                    ref={botonAccesibilidad}
                    type="button"
                    className="boton-accesibilidad"
                    aria-label={t.accesibilidad}
                    aria-haspopup="dialog"
                    aria-expanded={accesibilidadAbierta}
                    aria-controls="panel-accesibilidad"
                    onClick={() =>
                      setAccesibilidadAbierta((actual) => !actual)
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
                        d="M11.4583 3.74996C11.4583 4.55537 10.8054 5.20829 9.99996 5.20829C9.19454 5.20829 8.54163 4.55537 8.54163 3.74996C8.54163 2.94454 9.19454 2.29163 9.99996 2.29163C10.8054 2.29163 11.4583 2.94454 11.4583 3.74996Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        stroke="#141414"
                      />
                      <path
                        d="M4.16663 7.08337L9.99996 8.33337L15.8333 7.08337"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        stroke="#141414"
                      />
                      <path
                        d="M10 8.33337V12.0834L7.08337 17.0834"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        stroke="#141414"
                      />
                      <path
                        d="M10 12.0834L12.9167 17.0834"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        stroke="#141414"
                      />
                    </svg>
                  </button>

                  <PanelAccesibilidad
                    abierto={accesibilidadAbierta}
                    onCerrar={() => {
                      setAccesibilidadAbierta(false);
                      botonAccesibilidad.current?.focus();
                    }}
                    idioma={idioma}
                  />
                </div>
              </>
            )}

            <SelectorIdioma
              idioma={idioma}
              onCambiar={onCambiarIdioma}
              etiqueta={t.idioma}
            />

            <button
              className="ingresar-home"
              onClick={() => onCuenta("ingresar")}
            >
              {t.ingresar}
            </button>

            <button
              className="boton-home primario"
              onClick={() => onCuenta("registro")}
            >
              {t.registro}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
