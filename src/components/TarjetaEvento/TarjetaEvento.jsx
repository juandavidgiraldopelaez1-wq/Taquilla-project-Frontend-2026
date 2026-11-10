
import AficheEvento from "../AficheEvento/AficheEvento.jsx";
import IconoEvento from "../IconoEvento/IconoEvento.jsx";
import { dinero } from "../../data/catalogo.js";
import "./TarjetaEvento.css";

export default function TarjetaEvento({
  evento,
  onAbrir,
  en,
  textos,
}) {
  const textosTarjeta = textos?.paginas?.inicio?.tarjeta;
  const categoriasAPI = textos?.general?.categorias;

  // Traduce la categoría usando su identificador original de la API.
  const categoriaId = evento.original?.categoria;

  const categoria = en
    ? categoriasAPI?.[categoriaId] ?? evento.etiqueta
    : evento.etiqueta;

  const textoDesde = textosTarjeta?.desde ?? (en ? "From" : "Desde");

  const textoVerEvento =
    textosTarjeta?.botones?.verEvento ??
    (en ? "View event" : "Ver evento");

  const fecha = new Date(`${evento.fecha}T12:00:00`);

  const fechaFormateada = en
    ? fecha.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    : evento.horario;

  return (
    <article className="tarjeta-evento">
      <AficheEvento variante={evento.arte} />

      <div className="contenido-evento">
        <span className="etiqueta-evento">
          {categoria}
        </span>

        <h3>{evento.nombre}</h3>

        <p>
          <IconoEvento tipo="fecha" />
          {fechaFormateada}
        </p>

        <p>
          <IconoEvento tipo="lugar" />
          {evento.lugar}, {evento.ciudad}
        </p>

        <div className="precio-evento">
          <div>
            <small>{textoDesde}</small>
            <strong>{dinero(evento.precio)}</strong>
          </div>

          <button
            type="button"
            className="boton-home secundario"
            aria-label={`${textoVerEvento}: ${evento.nombre}`}
            onClick={() => onAbrir(evento)}
          >
            {textoVerEvento}
          </button>
        </div>
      </div>
    </article>
  );
}
