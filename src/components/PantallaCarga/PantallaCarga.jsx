import Icono from "../Icono/Icono.jsx";
import EstadoError from "../EstadoError/EstadoError.jsx";
import { usePreferencias } from "../../hooks/usePreferencias.js";
import "./PantallaCarga.css";

/**
 * Pantalla de carga mientras llegan los textos de la interfaz
 * (US-TAQ-S2-02). Sus mensajes no se escriben en el código: salen de
 * GET /textos?seccion=estados, una consulta pequeña que se pide aparte y
 * llega antes que el resto de los textos (indicación de la profesora).
 * Si los textos no se pueden cargar, muestra el estado de error con
 * «Reintentar», también con los textos de esa sección.
 */
export default function PantallaCarga() {
  const { textos, errorTextos, recargarTextos } = usePreferencias();
  const cargando = textos?.estados?.cargando;

  return (
    <div className="landing taquilla pantalla-carga">
      <main className="pantalla-carga-contenido">
        {/* Emblema de la marca (el nombre «taquilla» llega con los demás textos) */}
        <span className="pantalla-carga-emblema" aria-hidden="true">
          <Icono nombre="ticket" tamano={18} />
        </span>

        {errorTextos ? (
          <EstadoError error={errorTextos} onReintentar={recargarTextos} />
        ) : (
          <div
            className="pantalla-carga-estado"
            role="status"
            aria-live="polite"
          >
            <span className="pantalla-carga-giro" aria-hidden="true" />
            {cargando && (
              <>
                <h1>{cargando.titulo}</h1>
                <p>{cargando.texto}</p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
