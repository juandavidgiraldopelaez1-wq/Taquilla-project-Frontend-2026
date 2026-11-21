import Icono from "../Icono/Icono.jsx";
import "./MenuMovil.css";

/** Botón hamburguesa del menú móvil. Textos: textos.menuMovil.abrir/cerrar. */
export default function MenuMovil({
  abierto,
  onAlternar,
  menuId,
  botonRef,
  textos,
}) {
  return (
    <button
      type="button"
      ref={botonRef}
      className="boton-menu"
      aria-label={abierto ? textos?.cerrar : textos?.abrir}
      aria-expanded={abierto}
      aria-controls={menuId}
      onClick={onAlternar}
    >
      <Icono nombre={abierto ? "cerrar" : "menu"} tamano={22} />
    </button>
  );
}
