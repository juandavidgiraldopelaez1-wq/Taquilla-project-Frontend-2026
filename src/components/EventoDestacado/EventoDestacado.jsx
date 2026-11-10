
import AficheEvento from "../AficheEvento/AficheEvento.jsx";
import { dinero } from "../../data/catalogo.js";
import "./EventoDestacado.css";

export default function EventoDestacado({
  evento,
  en,
  textos,
  onAbrir,
}) {
  if (!evento) return null;

  const textosDestacado =
    textos?.paginas?.inicio?.hero?.destacado;

  const etiqueta =
    textosDestacado?.etiqueta ??
    (en ? "Featured" : "Destacado");

  const plantillaDesde =
    textosDestacado?.desde ??
    (en ? "From {precio}" : "Desde {precio}");

  const textoDesde = plantillaDesde.replace(
    "{precio}",
    dinero(evento.precio),
  );

  const textoVerEvento =
    textosDestacado?.botones?.verEvento ??
    (en ? "View event" : "Ver evento");

  return (
    <div className="destacado-taquilla">
      <AficheEvento variante={evento.arte} />

      <div className="ficha-destacado">
        <span className="etiqueta-evento">
          {etiqueta}
        </span>

        <h2>{evento.nombre}</h2>

        <p>
          {evento.horario} · {evento.lugar}
        </p>

        <div>
          <strong>{textoDesde}</strong>

          <button
            type="button"
            className="boton-home primario"
            onClick={() => onAbrir(evento)}
          >
            {textoVerEvento}
          </button>
        </div>
      </div>
    </div>
  );
}
