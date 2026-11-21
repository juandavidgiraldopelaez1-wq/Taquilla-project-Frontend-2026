import "./EstadoCarga.css";

/**
 * Estado de carga con esqueletos (US-TAQ-S2-02). El texto para lectores de
 * pantalla sale de textos.estados.cargando.
 */
export default function EstadoCarga({
  textos,
  tarjetas = 4,
  variante = "tarjetas",
}) {
  return (
    <div
      className={`estado-carga estado-carga--${variante}`}
      role="status"
      aria-live="polite"
    >
      <span className="solo-lectores">
        {textos?.estados?.cargando?.indicador}
      </span>
      {variante === "tarjetas" &&
        Array.from({ length: tarjetas }, (_, indice) => (
          <div className="esqueleto-tarjeta" key={indice} aria-hidden="true">
            <div className="esqueleto esqueleto-imagen" />
            <div className="esqueleto-contenido">
              <div className="esqueleto esqueleto-etiqueta" />
              <div className="esqueleto esqueleto-titulo" />
              <div className="esqueleto esqueleto-linea" />
              <div className="esqueleto esqueleto-linea corta" />
            </div>
          </div>
        ))}
      {variante === "bloque" && (
        <div className="esqueleto-bloque" aria-hidden="true">
          <div className="esqueleto esqueleto-imagen" />
          <div className="esqueleto esqueleto-titulo" />
          <div className="esqueleto esqueleto-linea" />
          <div className="esqueleto esqueleto-linea" />
          <div className="esqueleto esqueleto-linea corta" />
        </div>
      )}
    </div>
  );
}
