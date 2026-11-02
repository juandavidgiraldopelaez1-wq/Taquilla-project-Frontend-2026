
import { useId, useRef, useState } from "react";
import { NavLink } from "react-router";

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
  onCuenta,
}) {
  const [abierto, setAbierto] = useState(false);
  const [accesibilidadAbierta, setAccesibilidadAbierta] = useState(false);

  const boton = useRef(null);
  const botonAccesibilidad = useRef(null);

  const id = useId();
  const t = interfaz[idioma];

  function cerrarMenu() {
    setAbierto(false);
  }

  return (
    <header
      className={`cabecera-home ${abierto ? "menu-abierto" : ""}`}
      onKeyDown={(evento) => {
        if (evento.key !== "Escape") return;

        if (accesibilidadAbierta) {
          setAccesibilidadAbierta(false);
          botonAccesibilidad.current?.focus();
          return;
        }

        if (abierto) {
          cerrarMenu();
          boton.current?.focus();
        }
      }}
    >
      {abierto && (
        <button
          type="button"
          className="fondo-menu-movil"
          aria-label={t.cerrarMenu}
          onClick={cerrarMenu}
        />
      )}

      <div className="ancho-home fila-cabecera">
        <Marca nombre={nombre} tipo={tipo} />

        <a
          className="buscar-movil"
          href="#buscador-eventos"
          aria-label={t.buscar}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>
        </a>

        <button
          type="button"
          className="ingreso-movil"
          onClick={() => onCuenta("ingresar")}
        >
          {t.ingresar}
        </button>

        <MenuMovil
          abierto={abierto}
          onAlternar={() => setAbierto((actual) => !actual)}
          menuId={id}
          botonRef={boton}
          textos={t}
        />

        <nav
          id={id}
          className={`menu-home ${abierto ? "abierto" : ""}`}
          aria-label={t.navegacion}
        >
          <div className="menu-movil-cabecera">
            <Marca nombre={nombre} tipo={tipo} />
          </div>

          <div className="enlaces-menu-movil">
            <NavLink to="/" end onClick={cerrarMenu}>
              {t.inicio}
            </NavLink>

            <NavLink to="/explorar" onClick={cerrarMenu}>
              {t.explora}
            </NavLink>
          </div>

          <div className="espacio-menu-movil" aria-hidden="true" />

          <div className="acciones-home">
            <a
              className="buscar-cabecera"
              href="#buscador-eventos"
              onClick={cerrarMenu}
            >
              {t.buscar}
            </a>

            {tipo === "taquilla" && (
              <>
                <div className="grupo-menu-movil grupo-idioma-menu">
                  <span className="etiqueta-menu-movil">
                    {t.idioma}
                  </span>

                  <SelectorIdioma
                    idioma={idioma}
                    onCambiar={onCambiarIdioma}
                    etiqueta={t.idioma}
                  />
                </div>

                <div className="grupo-menu-movil grupo-accesibilidad-menu">
                  <span className="etiqueta-menu-movil">
                    {t.accesibilidad}
                  </span>

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
                </div>

                <div className="grupo-sesion-menu">
                  <button
                    type="button"
                    className="ingresar-home"
                    onClick={() => onCuenta("ingresar")}
                  >
                    {t.ingresar}
                  </button>

                  <button
                    type="button"
                    className="boton-home primario"
                    onClick={() => onCuenta("registro")}
                  >
                    {t.registro}
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
