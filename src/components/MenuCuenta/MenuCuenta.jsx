import { useEffect, useId, useRef, useState } from "react";
import Icono from "../Icono/Icono.jsx";
import { iniciales, interpolar } from "../../utils/formato.js";
import "./MenuCuenta.css";

/**
 * Avatar con el menú de cuenta (Figma: «Menú de cuenta»). Solo tiene la
 * opción Cerrar sesión. Se cierra con Escape o al hacer clic fuera.
 */
export default function MenuCuenta({ usuario, textos, onCerrarSesion }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);
  const boton = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!abierto) return undefined;

    function alHacerClic(evento) {
      if (!contenedor.current?.contains(evento.target)) setAbierto(false);
    }

    document.addEventListener("pointerdown", alHacerClic);
    return () => document.removeEventListener("pointerdown", alHacerClic);
  }, [abierto]);

  return (
    <div
      className="menu-cuenta"
      ref={contenedor}
      onKeyDown={(evento) => {
        if (evento.key === "Escape" && abierto) {
          evento.stopPropagation();
          setAbierto(false);
          boton.current?.focus();
        }
      }}
    >
      <button
        ref={boton}
        type="button"
        className="avatar-cuenta"
        aria-label={interpolar(textos?.usuario?.menu, {
          nombre: usuario.nombre,
        })}
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto((actual) => !actual)}
      >
        {iniciales(usuario.nombre)}
      </button>

      {abierto && (
        <div className="panel-cuenta" id={id}>
          <div className="persona-cuenta">
            <span
              className="avatar-cuenta avatar-cuenta--oscuro"
              aria-hidden="true"
            >
              {iniciales(usuario.nombre)}
            </span>
            <span>
              <strong>{usuario.nombre}</strong>
              <small>{usuario.correo}</small>
            </span>
          </div>
          <button
            type="button"
            className="opcion-cuenta"
            onClick={onCerrarSesion}
          >
            <Icono nombre="salir" tamano={18} />
            {textos?.usuario?.cerrarSesion}
          </button>
        </div>
      )}
    </div>
  );
}
