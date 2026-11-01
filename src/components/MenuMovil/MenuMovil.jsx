import "./MenuMovil.css";
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
      aria-label={abierto ? textos.cerrarMenu : textos.abrirMenu}
      aria-expanded={abierto}
      aria-controls={menuId}
      onClick={onAlternar}
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          d={abierto ? "m6 6 12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"}
        />
      </svg>
    </button>
  );
}
