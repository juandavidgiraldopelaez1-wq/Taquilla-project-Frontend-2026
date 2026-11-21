import { useId, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";

import Marca from "../Marca/Marca.jsx";
import MenuMovil from "../MenuMovil/MenuMovil.jsx";
import SelectorIdioma from "../SelectorIdioma/SelectorIdioma.jsx";
import PanelAccesibilidad from "../PanelAccesibilidad/PanelAccesibilidad.jsx";
import Boton from "../Boton/Boton.jsx";
import Icono from "../Icono/Icono.jsx";
import { usePreferencias } from "../../hooks/usePreferencias.js";
import { useRecurso } from "../../hooks/useRecurso.js";
import { textosFaltantes } from "../../config/textosFaltantes.js";
import { rutaExplorar } from "../../utils/filtros.js";
import "./Navbar.css";

function leerBusqueda(search) {
  return new URLSearchParams(search).get("q") || "";
}

/**
 * Encabezado con navegación (Figma: «Navegación» y «Menú móvil»).
 * Textos: textos.navbar y textos.menuMovil. Idiomas: GET /idiomas.
 */
export default function Navbar() {
  const { idioma, textos } = usePreferencias();
  const { datos: respuestaIdiomas } = useRecurso("/idiomas", { cache: true });
  const idiomas = respuestaIdiomas?.datos ?? [];

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

  const nav = textos?.navbar;
  const menu = textos?.menuMovil;

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
    navigate(rutaExplorar({ q: termino }));
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
          aria-label={menu?.cerrar}
          onClick={cerrarMenu}
        />
      )}

      <div className="ancho-home fila-cabecera">
        <Marca nombre={nav?.logo?.texto} etiqueta={nav?.logo?.aria} />

        <Link
          className="buscar-movil"
          to="/explorar"
          aria-label={nav?.buscador?.aria}
        >
          <Icono nombre="search" />
        </Link>

        <Link className="ingreso-movil" to="/ingresar">
          {nav?.botones?.ingresar}
        </Link>
        <MenuMovil
          abierto={abierto}
          onAlternar={() => setAbierto((actual) => !actual)}
          menuId={id}
          botonRef={boton}
          textos={menu}
        />

        <nav
          id={id}
          className={`menu-home ${abierto ? "abierto" : ""}`}
          aria-label={textosFaltantes[idioma].navegacionPrincipal}
        >
          <div className="menu-movil-cabecera">
            <Marca nombre={nav?.logo?.texto} etiqueta={nav?.logo?.aria} />
          </div>

          <div className="enlaces-menu-movil">
            <NavLink to="/" end onClick={cerrarMenu}>
              {menu?.enlaces?.inicio}
            </NavLink>

            <NavLink to="/explorar" onClick={cerrarMenu}>
              {menu?.enlaces?.explorar}
            </NavLink>
          </div>

          <div className="espacio-menu-movil" aria-hidden="true" />

          <div className="acciones-home">
            <form
              className="buscar-cabecera"
              role="search"
              onSubmit={buscarEventos}
            >
              <input
                type="search"
                value={busquedaCabecera}
                onChange={(evento) => setBusquedaCabecera(evento.target.value)}
                placeholder={nav?.buscador?.placeholder}
                aria-label={nav?.buscador?.aria}
              />

              <button
                type="submit"
                aria-label={nav?.buscador?.aria}
                disabled={!busquedaCabecera.trim()}
              >
                <Icono nombre="search" />
              </button>
            </form>

            <div className="grupo-menu-movil grupo-idioma-menu">
              <span className="etiqueta-menu-movil">
                {menu?.secciones?.idioma}
              </span>

              <SelectorIdioma idiomas={idiomas} />
            </div>

            <div className="grupo-menu-movil grupo-accesibilidad-menu">
              <span className="etiqueta-menu-movil">
                {menu?.secciones?.accesibilidad}
              </span>

              <div className="accesibilidad-home">
                <button
                  ref={botonAccesibilidad}
                  type="button"
                  className="boton-accesibilidad"
                  aria-label={nav?.aria?.accesibilidad}
                  aria-haspopup="dialog"
                  aria-expanded={accesibilidadAbierta}
                  aria-controls="panel-accesibilidad"
                  onClick={() => setAccesibilidadAbierta((actual) => !actual)}
                >
                  <Icono nombre="accesibilidad" tamano={24} />
                </button>

                <PanelAccesibilidad
                  abierto={accesibilidadAbierta}
                  onCerrar={() => {
                    setAccesibilidadAbierta(false);
                    botonAccesibilidad.current?.focus();
                  }}
                />
              </div>
            </div>

            <div className="grupo-sesion-menu">
              <Link
                className="ingresar-home"
                to="/ingresar"
                onClick={cerrarMenu}
              >
                {nav?.botones?.ingresar}
              </Link>
              <Boton variante="primario" to="/registro" onClick={cerrarMenu}>
                {nav?.botones?.crearCuenta}
              </Boton>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
