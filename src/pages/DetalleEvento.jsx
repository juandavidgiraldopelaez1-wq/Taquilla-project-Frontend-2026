import { Link, useParams } from "react-router";

import LayoutPublico from "../components/LayoutPublico/LayoutPublico.jsx";
import AficheEvento from "../components/AficheEvento/AficheEvento.jsx";
import Etiqueta from "../components/Etiqueta/Etiqueta.jsx";
import Icono from "../components/Icono/Icono.jsx";
import TarjetaEvento from "../components/TarjetaEvento/TarjetaEvento.jsx";
import EstadoCarga from "../components/EstadoCarga/EstadoCarga.jsx";
import EstadoError from "../components/EstadoError/EstadoError.jsx";
import Boton from "../components/Boton/Boton.jsx";
import NoEncontrado from "./NoEncontrado.jsx";
import { usePreferencias } from "../hooks/usePreferencias.js";
import { useRecurso } from "../hooks/useRecurso.js";
import { textosFaltantes } from "../config/textosFaltantes.js";
import {
  formatoFecha,
  formatoFechaHora,
  formatoHora,
  formatoPrecio,
  interpolar,
} from "../utils/formato.js";
import "./DetalleEvento.css";

/**
 * Vista 3 · Detalle de un evento, en /eventos/:slug (US-TAQ-S2-01).
 * Datos: GET /eventos/:slug y GET /eventos/:slug/relacionados.
 */
export default function DetalleEvento() {
  const { slug } = useParams();
  const { idioma, textos } = usePreferencias();
  const t = textos?.paginas?.detalleEvento;

  const detalle = useRecurso(`/eventos/${encodeURIComponent(slug)}`);
  const relacionados = useRecurso(
    `/eventos/${encodeURIComponent(slug)}/relacionados`,
  );

  // 404 no_encontrado → página de no encontrado (equivalente a notFound()).
  if (detalle.error?.codigo === "no_encontrado") {
    return (
      <NoEncontrado
        titulo={t?.noEncontrado?.titulo}
        texto={t?.noEncontrado?.texto}
        accion={
          <Boton variante="primario" to="/explorar">
            {t?.noEncontrado?.botones?.volver}
          </Boton>
        }
      />
    );
  }

  const evento = detalle.cargando ? null : detalle.datos;

  return (
    <LayoutPublico
      titulo={evento && interpolar(t?.seo?.titulo, { titulo: evento.titulo })}
      descripcion={evento?.descripcion ?? t?.seo?.descripcion}
    >
      <div className="detalle-evento ancho-home">
        {detalle.error ? (
          <EstadoError error={detalle.error} onReintentar={detalle.recargar} />
        ) : !evento ? (
          <EstadoCarga textos={textos} variante="bloque" />
        ) : (
          <FichaEvento evento={evento} idioma={idioma} textos={textos} />
        )}

        <section className="relacionados" aria-labelledby="relacionados-titulo">
          <h2 id="relacionados-titulo">{t?.relacionados?.titulo}</h2>
          {relacionados.cargando ? (
            <EstadoCarga textos={textos} />
          ) : relacionados.error ? (
            <EstadoError
              error={relacionados.error}
              onReintentar={relacionados.recargar}
            />
          ) : (
            <div className="eventos-grid">
              {(relacionados.datos?.datos ?? []).slice(0, 4).map((item) => (
                <TarjetaEvento key={item.id} evento={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </LayoutPublico>
  );
}

/** Portada, datos, pestañas y secciones del evento. */
function FichaEvento({ evento, idioma, textos }) {
  const t = textos?.paginas?.detalleEvento;
  const general = textos?.general;
  const disponibilidad = textos?.componentes?.etiquetas?.disponibilidad;
  const faltantes = textosFaltantes[idioma];
  const migas = textos?.componentes?.migas;

  const edad =
    evento.edadMinima > 0
      ? interpolar(t?.etiquetas?.edadMinima, { edad: evento.edadMinima })
      : t?.etiquetas?.todoPublico;

  const lugar = interpolar(general?.formatos?.lugarYCiudad, {
    lugar: evento.recinto?.nombre,
    ciudad: evento.recinto?.ciudad,
  });

  function textoDisponible(item) {
    if (item.agotada) return disponibilidad?.agotada;
    return interpolar(disponibilidad?.quedan, { cantidad: item.disponibles });
  }

  return (
    <article className="ficha-evento">
      <nav className="migas-detalle" aria-label={faltantes.migas}>
        <Link to="/">{migas?.inicio}</Link>
        <Icono nombre="chevR" tamano={14} />
        <Link to="/explorar">{migas?.explorar}</Link>
        <Icono nombre="chevR" tamano={14} />
        <span aria-current="page">{evento.titulo}</span>
      </nav>

      <AficheEvento afiche={evento.afiche} className="portada-detalle" />

      <header className="encabezado-detalle">
        <div className="etiquetas-detalle">
          <Etiqueta tono="marca">
            {general?.categorias?.singular?.[evento.categoria] ??
              evento.categoria}
          </Etiqueta>
          <Etiqueta tono="marca">{edad}</Etiqueta>
        </div>
        <h1>{evento.titulo}</h1>
        {evento.artistas?.length > 0 && (
          <p className="artistas-detalle">{evento.artistas.join(" · ")}</p>
        )}

        <dl className="datos-detalle">
          <div>
            <span className="icono-dato">
              <Icono nombre="calendar" />
            </span>
            <dt>{t?.info?.fecha}</dt>
            <dd>{formatoFecha(evento.fecha, idioma)}</dd>
          </div>
          <div>
            <span className="icono-dato">
              <Icono nombre="clock" />
            </span>
            <dt>{t?.info?.hora}</dt>
            <dd>{formatoHora(evento.fecha, idioma)}</dd>
          </div>
          <div>
            <span className="icono-dato">
              <Icono nombre="pin" />
            </span>
            <dt>{t?.info?.lugar}</dt>
            <dd>{lugar}</dd>
          </div>
          <div>
            <span className="icono-dato">
              <Icono nombre="ticket" />
            </span>
            <dt>{t?.info?.desde}</dt>
            <dd>{formatoPrecio(evento.precioDesde)}</dd>
          </div>
        </dl>
      </header>

      <nav className="pestanas-detalle" aria-label={t?.pestanas?.descripcion}>
        <a href="#descripcion">{t?.pestanas?.descripcion}</a>
        <a href="#como-llegar">{t?.pestanas?.comoLlegar}</a>
        <a href="#politicas">{t?.pestanas?.politicas}</a>
      </nav>

      <section id="descripcion" className="seccion-detalle">
        <h2>{t?.descripcion?.titulo}</h2>
        <p>{evento.descripcion}</p>
      </section>

      {evento.funciones?.length > 0 && (
        <section className="seccion-detalle">
          <h2>{faltantes.funciones}</h2>
          <ul className="lista-detalle">
            {evento.funciones.map((funcion) => (
              <li key={funcion.id}>
                <span>
                  {formatoFechaHora(
                    funcion.fecha,
                    idioma,
                    general?.formatos?.fechaYHora,
                  )}
                </span>
                <Etiqueta tono={funcion.agotada ? "error" : "exito"}>
                  {textoDisponible(funcion)}
                </Etiqueta>
              </li>
            ))}
          </ul>
        </section>
      )}

      {evento.localidades?.length > 0 && (
        <section className="seccion-detalle">
          <h2>{faltantes.localidades}</h2>
          <ul className="lista-detalle">
            {evento.localidades.map((localidad) => (
              <li key={localidad.id}>
                <span className="nombre-localidad">{localidad.nombre}</span>
                <strong>{formatoPrecio(localidad.precio)}</strong>
                <Etiqueta tono={localidad.agotada ? "error" : "exito"}>
                  {textoDisponible(localidad)}
                </Etiqueta>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="como-llegar" className="seccion-detalle">
        <h2>{t?.pestanas?.comoLlegar}</h2>
        <div className="mapa-detalle" role="img" aria-label={t?.mapa?.titulo}>
          <Icono nombre="pin" tamano={28} />
          <span>{t?.mapa?.titulo}</span>
        </div>
        <p>
          {[
            evento.recinto?.nombre,
            evento.recinto?.direccion,
            evento.recinto?.ciudad,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </section>

      <section id="politicas" className="seccion-detalle">
        <h2>{t?.pestanas?.politicas}</h2>
        <p>{edad}</p>
        {evento.duracionMin > 0 && (
          <p>
            {interpolar(general?.formatos?.duracion, {
              horas: Math.floor(evento.duracionMin / 60),
              minutos: evento.duracionMin % 60,
            })}
          </p>
        )}
        {evento.organizador?.nombre && <p>{evento.organizador.nombre}</p>}
      </section>
    </article>
  );
}
