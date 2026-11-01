import AficheEvento from "../AficheEvento/AficheEvento.jsx";
import IconoEvento from "../IconoEvento/IconoEvento.jsx";
import { categorias, categoriasEn, dinero } from "../../data/catalogo.js";
import "./TarjetaEvento.css";
export default function TarjetaEvento({ evento, onAbrir, en }) {
  return (
    <article className="tarjeta-evento">
      <AficheEvento variante={evento.arte} />
      <div className="contenido-evento">
        <span className="etiqueta-evento">
          {en
            ? categoriasEn[categorias.indexOf(evento.categoria)]
            : evento.etiqueta}
        </span>
        <h3>{evento.nombre}</h3>
        <p>
          <IconoEvento tipo="fecha" />
          {en
            ? new Date(`${evento.fecha}T12:00:00`).toLocaleDateString("en", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            : evento.horario}
        </p>
        <p>
          <IconoEvento tipo="lugar" />
          {evento.lugar}, {evento.ciudad}
        </p>
        <div className="precio-evento">
          <div>
            <small>{en ? "From" : "Desde"}</small>
            <strong>{dinero(evento.precio)}</strong>
          </div>
          <button
            className="boton-home secundario"
            aria-label={`${en ? "View event" : "Ver evento"}: ${evento.nombre}`}
            onClick={() => onAbrir(evento)}
          >
            {en ? "View event" : "Ver evento"}
          </button>
        </div>
      </div>
    </article>
  );
}
