import Boton from "../Boton/Boton.jsx";
import Icono from "../Icono/Icono.jsx";
import { usePreferencias } from "../../hooks/usePreferencias.js";
import "./EstadoError.css";

/**
 * Estado de error con botón para reintentar (US-TAQ-S2-02).
 * El mensaje sale de textos.errores[codigo] cuando la API envía un código;
 * si no, usa el texto general de textos.estados.error.
 */
export default function EstadoError({ error, onReintentar }) {
  const { textos } = usePreferencias();
  const estado = textos?.estados?.error;
  const mensaje =
    (error?.codigo && textos?.errores?.[error.codigo]) || estado?.texto;

  return (
    <div className="estado-error" role="alert">
      <Icono nombre="alerta" />
      <div>
        <h2>{estado?.titulo}</h2>
        <p>{mensaje}</p>
      </div>
      {onReintentar && (
        <Boton variante="secundario" onClick={onReintentar}>
          {estado?.botones?.reintentar}
        </Boton>
      )}
    </div>
  );
}
