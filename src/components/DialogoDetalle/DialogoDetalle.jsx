import { useEffect, useRef, useId } from "react";
import "./DialogoDetalle.css";
export default function DialogoDetalle({ detalle, onCerrar }) {
  const dialogo = useRef(null);
  const id = useId();
  useEffect(() => {
    if (detalle && !dialogo.current.open) dialogo.current.showModal();
    if (!detalle && dialogo.current.open) dialogo.current.close();
  }, [detalle]);
  return (
    <dialog
      className="detalle-home"
      ref={dialogo}
      onClose={onCerrar}
      aria-labelledby={id}
    >
      <button
        className="cerrar-detalle"
        aria-label="Cerrar / Close"
        onClick={() => dialogo.current.close()}
      >
        ×
      </button>
      <h2 id={id}>{detalle?.titulo}</h2>
      <p>{detalle?.descripcion}</p>
      {detalle?.contenido}
      <button
        className="boton-home primario"
        onClick={() => dialogo.current.close()}
      >
        {detalle?.cerrar ?? "Cerrar"}
      </button>
    </dialog>
  );
}
