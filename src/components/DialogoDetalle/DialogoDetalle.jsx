import { useEffect, useRef, useId } from "react";
import "./DialogoDetalle.css";
import Boton from "../Boton/Boton.jsx";
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
      <Boton variante="primario" onClick={() => dialogo.current.close()}>
        {detalle?.cerrar ?? "Cerrar"}
      </Boton>
    </dialog>
  );
}
