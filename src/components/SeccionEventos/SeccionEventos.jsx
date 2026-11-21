import { Link } from "react-router";
import Flecha from "../Flecha/Flecha.jsx";
import TarjetaEvento from "../TarjetaEvento/TarjetaEvento.jsx";
import EstadoCarga from "../EstadoCarga/EstadoCarga.jsx";
import EstadoError from "../EstadoError/EstadoError.jsx";
import EstadoVacio from "../EstadoVacio/EstadoVacio.jsx";
import "./SeccionEventos.css";

/**
 * Sección con título, enlace «Ver todos» y cuadrícula de tarjetas.
 * `estado` es el resultado de useRecurso: { cargando, error, recargar }.
 */
export default function SeccionEventos({
  id,
  titulo,
  tituloMovil,
  descripcion,
  verTodos,
  eventos,
  estado,
  textos,
}) {
  return (
    <section
      className="seccion-eventos"
      id={id}
      aria-labelledby={`${id}-titulo`}
    >
      <div className="titulo-seccion">
        <div>
          <h2 id={`${id}-titulo`}>
            <span className="titulo-escritorio">{titulo}</span>
            <span className="titulo-movil">{tituloMovil ?? titulo}</span>
          </h2>
          <p>{descripcion}</p>
        </div>
        {verTodos && (
          <Link className="enlace-home" to={verTodos.to}>
            {verTodos.texto}
            <Flecha />
          </Link>
        )}
      </div>

      {estado?.cargando ? (
        <EstadoCarga textos={textos} tarjetas={eventos?.length || 4} />
      ) : estado?.error ? (
        <EstadoError error={estado.error} onReintentar={estado.recargar} />
      ) : eventos.length ? (
        <div className="eventos-grid">
          {eventos.map((evento) => (
            <TarjetaEvento key={evento.id} evento={evento} />
          ))}
        </div>
      ) : (
        <EstadoVacio textos={textos} />
      )}
    </section>
  );
}
