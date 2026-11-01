import AficheEvento from "../AficheEvento/AficheEvento.jsx";
import { dinero } from "../../data/catalogo.js";
import "./EventoDestacado.css";
export default function EventoDestacado({ evento, en, onAbrir }) {
  return (
    <div className="destacado-taquilla">
      <AficheEvento variante={evento.arte} />
      <div className="ficha-destacado">
        <span className="etiqueta-evento">{en ? "Featured" : "Destacado"}</span>
        <h2>{evento.nombre}</h2>
        <p>
          {evento.horario} · {evento.lugar}
        </p>
        <div>
          <strong>
            {en ? "From" : "Desde"} {dinero(evento.precio)}
          </strong>
          <button
            className="boton-home primario"
            onClick={() => onAbrir(evento)}
          >
            {en ? "View event" : "Ver evento"}
          </button>
        </div>
      </div>
    </div>
  );
}
