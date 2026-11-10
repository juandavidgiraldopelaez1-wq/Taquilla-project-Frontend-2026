
import { useEffect, useId, useRef, useState } from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router";

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
  textos,
  onCambiarIdioma,
  onCuenta,
}) {
  const [abierto, setAbierto] = useState(false);
  const [accesibilidadAbierta, setAccesibilidadAbierta] = useState(false);
  const [busquedaCabecera, setBusquedaCabecera] = useState("");

  const boton = useRef(null);
  const botonAccesibilidad = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const id = useId();

  // Textos locales de respaldo mientras llega la respuesta de la API.
  const base = interfaz[idioma] || interfaz.es;

  const apiNavbar = textos?.navbar;
  const apiMenu = textos?.menuMovil;

  // Prioriza los textos proporcionados por la API.
  const t = {
    ...base,

    inicio: apiNavbar?.enlaces?.inicio ?? base.inicio,
    explora: apiNavbar?.enlaces?.explorar ?? base.explora,

    ingresar: apiNavbar?.botones?.ingresar ?? base.ingresar,
    registro: apiNavbar?.botones?.crearCuenta ?? base.registro,

    buscar: apiNavbar?.buscador?.placeholder ?? base.buscar,
    buscarAria: apiNavbar?.buscador?.aria ?? base.buscar,

    abrirMenu: apiMenu?.abrir ?? base.abrirMenu,
    cerrarMenu: apiMenu?.cerrar ?? base.cerrarMenu,

    idioma:
      apiMenu?.secciones?.idioma ??
      textos?.idioma?.tituloMovil ??
      base.idioma,

    idiomaAria:
      apiNavbar?.aria?.idioma ??
      base.idioma,

    accesibilidad:
      apiMenu?.secciones?.accesibilidad ??
      base.accesibilidad,

    accesibilidadAria:
      apiNavbar?.aria?.accesibilidad ??
      base.accesibilidad,

    navegacion: base.navegacion,
  };

  // Mantiene sincronizado el buscador con la búsqueda de Explorar.
  useEffect(() => {
    const parametros = new URLSearchParams(location.search);
    setBusquedaCabecera(parametros.get("q") || "");
  }, [location.search]);

  function cerrarMenu() {
    setAbierto(false);
  }

  function buscarEventos(evento) {
    evento.preventDefault();

    const termino = busquedaCabecera.trim();

    if (!termino) return;

    cerrarMenu();
    navigate(`/explorar?q=${encodeURIComponent(termino)}`);
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
          href="/explorar"
          aria-label={t.buscarAria}
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
            {tipo === "taquilla" && (
              <>
                <form
                  className="buscar-cabecera"
                  role="search"
                  onSubmit={buscarEventos}
                >
                  <input
                    type="search"
                    value={busquedaCabecera}
                    onChange={(evento) =>
                      setBusquedaCabecera(evento.target.value)
                    }
                    placeholder={t.buscar}
                    aria-label={t.buscarAria}
                  />

                  <button
                    type="submit"
                    aria-label={t.buscarAria}
                    disabled={!busquedaCabecera.trim()}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m16 16 4 4" />
                    </svg>
                  </button>
                </form>

                <div className="grupo-menu-movil grupo-idioma-menu">
                  <span className="etiqueta-menu-movil">
                    {t.idioma}
                  </span>

                  <SelectorIdioma
                    idioma={idioma}
                    onCambiar={onCambiarIdioma}
                    etiqueta={t.idiomaAria}
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
                      aria-label={t.accesibilidadAria}
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
