import Flecha from "../Flecha/Flecha.jsx";
import TarjetaEvento from "../TarjetaEvento/TarjetaEvento.jsx";
import "./SeccionEventos.css";
export default function SeccionEventos({
  id,
  titulo,
  descripcion,
  eventos,
  en,
  onAbrir,
  onVerTodos,
}) {
  return (
    <section
      className="seccion-eventos"
      id={id}
      aria-labelledby={`${id}-titulo`}
    >
      <div className="titulo-seccion">
        <div>
          <h2 id={`${id}-titulo`}>{titulo}</h2>
          <p role="status">{descripcion}</p>
        </div>
        <button className="enlace-home" onClick={onVerTodos}>
          {en ? "View all" : "Ver todos"}
          <Flecha />
        </button>
      </div>
      <div className="eventos-grid">
        {eventos.map((evento) => (
          <TarjetaEvento
            key={evento.nombre}
            evento={evento}
            en={en}
            onAbrir={onAbrir}
          />
        ))}
      </div>
      {!eventos.length && (
        <div className="sin-resultados">
          <h3>{en ? "No events found" : "No encontramos eventos"}</h3>
          <p>{en ? "Try another search." : "Prueba con otra búsqueda."}</p>
          <button className="boton-home primario" onClick={onVerTodos}>
            {en ? "View all events" : "Ver todos los eventos"}
          </button>
        </div>
      )}
    </section>
  );
}
