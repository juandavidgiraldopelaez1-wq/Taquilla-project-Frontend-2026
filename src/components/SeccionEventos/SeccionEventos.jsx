
import Flecha from "../Flecha/Flecha.jsx";
import TarjetaEvento from "../TarjetaEvento/TarjetaEvento.jsx";
import "./SeccionEventos.css";

export default function SeccionEventos({
  id,
  titulo,
  tituloMovil,
  descripcion,
  eventos,
  en,
  textos,
  onAbrir,
  onVerTodos,
}) {
  const acciones = textos?.general?.acciones;
  const vacio = textos?.paginas?.explorar?.vacio;

  const textoVerTodos =
    acciones?.verTodos ?? (en ? "View all" : "Ver todos");

  const textoSinEventos =
    vacio?.titulo ?? (en ? "No events found" : "No encontramos eventos");

  const descripcionSinEventos =
    vacio?.texto ?? (en ? "Try another search." : "Prueba con otra búsqueda.");

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
          <p role="status">{descripcion}</p>
        </div>

        <button
          type="button"
          className="enlace-home"
          onClick={onVerTodos}
        >
          {textoVerTodos}
          <Flecha />
        </button>
      </div>

      <div className="eventos-grid">
        {eventos.map((evento) => (
          <TarjetaEvento
            key={evento.id ?? evento.nombre}
            evento={evento}
            en={en}
            textos={textos}
            onAbrir={onAbrir}
          />
        ))}
      </div>

      {!eventos.length && (
        <div className="sin-resultados">
          <h3>{textoSinEventos}</h3>
          <p>{descripcionSinEventos}</p>

          <button
            type="button"
            className="boton-home primario"
            onClick={onVerTodos}
          >
            {textoVerTodos}
          </button>
        </div>
      )}
    </section>
  );
}
