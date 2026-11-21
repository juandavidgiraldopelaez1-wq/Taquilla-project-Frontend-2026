import "./EstadoVacio.css";

/**
 * Estado vacío (US-TAQ-S2-02). Por defecto usa textos.estados.vacio; una
 * vista puede pasar su propio título, texto y acción (por ejemplo Explorar).
 */
export default function EstadoVacio({ textos, titulo, texto, accion }) {
  return (
    <div className="estado-vacio" role="status">
      <h2>{titulo ?? textos?.estados?.vacio?.titulo}</h2>
      <p>{texto ?? textos?.estados?.vacio?.texto}</p>
      {accion}
    </div>
  );
}
