import { Link } from "react-router";
import AficheEvento from "../AficheEvento/AficheEvento.jsx";
import IconoEvento from "../IconoEvento/IconoEvento.jsx";
import Etiqueta from "../Etiqueta/Etiqueta.jsx";
import Boton from "../Boton/Boton.jsx";
import { usePreferencias } from "../../hooks/usePreferencias.js";
import {
  formatoFechaHora,
  formatoPrecio,
  interpolar,
} from "../../utils/formato.js";
import "./TarjetaEvento.css";

/**
 * Tarjeta de evento (Figma: «Tarjeta de evento»). Recibe el evento tal como
 * lo entrega la API. Toda la tarjeta lleva al detalle /eventos/:slug.
 */
export default function TarjetaEvento({ evento }) {
  const { idioma, textos } = usePreferencias();
  const t = textos?.paginas?.inicio?.tarjeta;
  const general = textos?.general;
  const ruta = `/eventos/${evento.slug}`;

  return (
    <article className="tarjeta-evento">
      <AficheEvento afiche={evento.afiche} />
      <div className="contenido-evento">
        <Etiqueta tono="marca">
          {general?.categorias?.singular?.[evento.categoria] ??
            evento.categoria}
        </Etiqueta>
        <h3>
          <Link to={ruta} className="enlace-tarjeta">
            {evento.titulo}
          </Link>
        </h3>
        <p>
          <IconoEvento tipo="fecha" tamano={16} />
          {formatoFechaHora(
            evento.fecha,
            idioma,
            general?.formatos?.fechaYHora,
          )}
        </p>
        <p>
          <IconoEvento tipo="lugar" tamano={16} />
          {interpolar(general?.formatos?.lugarYCiudad, {
            lugar: evento.recinto?.nombre,
            ciudad: evento.recinto?.ciudad,
          })}
        </p>
        <div className="precio-evento">
          <div>
            <small>{t?.desde}</small>
            <strong>{formatoPrecio(evento.precioDesde)}</strong>
          </div>
          <Boton
            variante="secundario"
            to={ruta}
            tabIndex={-1}
            aria-hidden="true"
          >
            {t?.botones?.verEvento}
          </Boton>
        </div>
      </div>
    </article>
  );
}
