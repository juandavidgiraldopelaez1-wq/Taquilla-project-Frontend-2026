import { Link } from "react-router";
import AficheEvento from "../AficheEvento/AficheEvento.jsx";
import Etiqueta from "../Etiqueta/Etiqueta.jsx";
import Boton from "../Boton/Boton.jsx";
import {
  formatoFecha,
  formatoPrecio,
  interpolar,
} from "../../utils/formato.js";
import { usePreferencias } from "../../hooks/usePreferencias.js";
import "./EventoDestacado.css";

/** Ficha del evento destacado del hero (Figma: «Evento destacado»). */
export default function EventoDestacado({ evento, textos }) {
  const { idioma } = usePreferencias();

  if (!evento) return null;

  const t = textos?.paginas?.inicio?.hero?.destacado;
  const ruta = `/eventos/${evento.slug}`;

  return (
    <div className="destacado-taquilla">
      <AficheEvento afiche={evento.afiche} />
      <div className="ficha-destacado">
        <Etiqueta tono="marca">{t?.etiqueta}</Etiqueta>
        <h2>
          <Link to={ruta}>{evento.titulo}</Link>
        </h2>
        <p>
          {interpolar(textos?.general?.formatos?.fechaYLugar, {
            fecha: formatoFecha(evento.fecha, idioma),
            lugar: evento.recinto?.nombre,
          })}
        </p>
        <div>
          <strong>
            {interpolar(t?.desde, {
              precio: formatoPrecio(evento.precioDesde),
            })}
          </strong>
          <Boton variante="primario" to={ruta} tabIndex={-1} aria-hidden="true">
            {t?.botones?.verEvento}
          </Boton>
        </div>
      </div>
    </div>
  );
}
