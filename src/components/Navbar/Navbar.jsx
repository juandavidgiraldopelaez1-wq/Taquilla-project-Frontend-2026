import { useId, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";

import Marca from "../Marca/Marca.jsx";
import MenuMovil from "../MenuMovil/MenuMovil.jsx";
import SelectorIdioma from "../SelectorIdioma/SelectorIdioma.jsx";
import PanelAccesibilidad from "../PanelAccesibilidad/PanelAccesibilidad.jsx";

import { interfaz } from "../../data/interfaz.js";
import "./Navbar.css";
import Boton from "../Boton/Boton.jsx";
import Icono from "../Icono/Icono.jsx";

function leerBusqueda(search) {
  return new URLSearchParams(search).get("q") || "";
}

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

  const boton = useRef(null);
  const botonAccesibilidad = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const esExplorar = location.pathname === "/explorar";
  const [busquedaCabecera, setBusquedaCabecera] = useState(() =>
    leerBusqueda(location.search),
  );
  const [busquedaPrevia, setBusquedaPrevia] = useState(location.search);

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
      apiMenu?.secciones?.idioma ?? textos?.idioma?.tituloMovil ?? base.idioma,

    idiomaAria: apiNavbar?.aria?.idioma ?? base.idioma,

    accesibilidad: apiMenu?.secciones?.accesibilidad ?? base.accesibilidad,

    accesibilidadAria: apiNavbar?.aria?.accesibilidad ?? base.accesibilidad,

    navegacion: base.navegacion,
  };

  // Mantiene sincronizado el buscador con la búsqueda de Explorar.
  if (busquedaPrevia !== location.search) {
    setBusquedaPrevia(location.search);
    setBusquedaCabecera(leerBusqueda(location.search));
  }

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
      className={`cabecera-home ${
        abierto ? "menu-abierto" : ""
      } ${esExplorar ? "cabecera-explorar" : ""}`}
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
        <Marca nombre={nombre} etiqueta={t.inicio} />

        <a className="buscar-movil" href="/explorar" aria-label={t.buscarAria}>
          <Icono nombre="search" />
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
            <Marca nombre={nombre} etiqueta={t.inicio} />
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
                    <Icono nombre="search" />
                  </button>
                </form>

                <div className="grupo-menu-movil grupo-idioma-menu">
                  <span className="etiqueta-menu-movil">{t.idioma}</span>

                  <SelectorIdioma
                    idioma={idioma}
                    onCambiar={onCambiarIdioma}
                    etiqueta={t.idiomaAria}
                  />
                </div>

                <div className="grupo-menu-movil grupo-accesibilidad-menu">
                  <span className="etiqueta-menu-movil">{t.accesibilidad}</span>

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
                      <Icono nombre="accesibilidad" tamano={24} />
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

                  <Boton
                    variante="primario"
                    onClick={() => onCuenta("registro")}
                  >
                    {t.registro}
                  </Boton>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
