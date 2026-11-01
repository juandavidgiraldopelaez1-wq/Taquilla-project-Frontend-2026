import { useId, useRef, useState } from "react";
import Marca from "../Marca/Marca.jsx";
import MenuMovil from "../MenuMovil/MenuMovil.jsx";
import SelectorIdioma from "../SelectorIdioma/SelectorIdioma.jsx";
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
  const boton = useRef(null);
  const id = useId();
  const t = interfaz[idioma];
  return (
    <header
      className="cabecera-home"
      onKeyDown={(evento) => {
        if (evento.key === "Escape" && abierto) {
          setAbierto(false);
          boton.current?.focus();
        }
      }}
    >
      <div className="ancho-home fila-cabecera">
        <Marca nombre={nombre} tipo={tipo} />
        <button className="ingreso-movil" onClick={() => onCuenta("ingresar")}>
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
              <a
                className="buscar-cabecera"
                href="#buscador-eventos"
                onClick={() => setAbierto(false)}
              >
                {t.buscar}
              </a>
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
