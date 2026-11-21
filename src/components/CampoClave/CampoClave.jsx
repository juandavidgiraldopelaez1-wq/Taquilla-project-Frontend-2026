import { useState } from "react";
import Campo from "../Campo/Campo.jsx";
import Icono from "../Icono/Icono.jsx";
import "./CampoClave.css";

/**
 * Campo de contraseña con botón para mostrarla u ocultarla (Figma: «Campo
 * de contraseña»). El botón dice su estado a los lectores de pantalla con
 * su nombre («Mostrar contraseña» / «Ocultar contraseña») y aria-pressed.
 */
export default function CampoClave({
  textoMostrar,
  textoOcultar,
  ref,
  ...props
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Campo
      {...props}
      ref={ref}
      type={visible ? "text" : "password"}
      sufijo={
        <button
          type="button"
          className="boton-ver-clave"
          aria-label={visible ? textoOcultar : textoMostrar}
          aria-pressed={visible}
          onClick={() => setVisible((actual) => !actual)}
        >
          <Icono nombre={visible ? "ojoTachado" : "ojo"} />
        </button>
      }
    />
  );
}
