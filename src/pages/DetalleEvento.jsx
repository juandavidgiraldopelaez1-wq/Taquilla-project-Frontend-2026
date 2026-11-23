import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

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

// En celular la descripción se recorta y aparece «Leer más» (Figma 10:227).
const LARGO_DESCRIPCION_CORTA = 140;

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
      sinNavbarMovil={Boolean(evento)}
    >
      <div className="detalle-evento">
        {detalle.error ? (
          <div className="ancho-home">
            <EstadoError
              error={detalle.error}
              onReintentar={detalle.recargar}
            />
          </div>
        ) : !evento ? (
          <div className="ancho-home">
            <EstadoCarga textos={textos} variante="bloque" />
          </div>
        ) : (
          <FichaEvento evento={evento} idioma={idioma} textos={textos} />
        )}

        <section
          className="relacionados ancho-home"
          aria-labelledby="relacionados-titulo"
        >
          <h2 id="relacionados-titulo">{t?.relacionados?.titulo}</h2>
          {relacionados.cargando ? (
            <EstadoCarga textos={textos} />
          ) : relacionados.error ? (
            <EstadoError
              error={relacionados.error}
              onReintentar={relacionados.recargar}
            />
          ) : (
            <div className="relacionados-grid">
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
  const navigate = useNavigate();
  const [pestana, setPestana] = useState("descripcion");
  const [descripcionCompleta, setDescripcionCompleta] = useState(false);

  const t = textos?.paginas?.detalleEvento;
  const general = textos?.general;
  const disponibilidad = textos?.componentes?.etiquetas?.disponibilidad;
  const faltantes = textosFaltantes[idioma];
  const migas = textos?.componentes?.migas;

  const edad =
    evento.edadMinima > 0
      ? interpolar(t?.etiquetas?.edadMinima, { edad: evento.edadMinima })
      : t?.etiquetas?.todoPublico;

  const fecha = formatoFecha(evento.fecha, idioma, { anio: true });
  const hora = formatoHora(evento.fecha, idioma);

  const lugar = interpolar(general?.formatos?.lugarYCiudad, {
    lugar: evento.recinto?.nombre,
    ciudad: evento.recinto?.ciudad,
  });

  const direccion = [evento.recinto?.direccion, evento.recinto?.ciudad]
    .filter(Boolean)
    .join(", ");

  const descripcionLarga =
    (evento.descripcion?.length ?? 0) > LARGO_DESCRIPCION_CORTA;

  const pestanas = [
    { id: "descripcion", texto: t?.pestanas?.descripcion },
    { id: "como-llegar", texto: t?.pestanas?.comoLlegar },
    { id: "politicas", texto: t?.pestanas?.politicas },
  ];

  function textoDisponible(item) {
    if (item.agotada) return disponibilidad?.agotada;
    return interpolar(disponibilidad?.quedan, { cantidad: item.disponibles });
  }

  // Botón atrás de la portada en celular: vuelve a la página anterior o,
  // si se entró directo al enlace, a Explorar.
  function volver() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/explorar");
  }

  // Botón compartir: usa el menú del sistema si existe; si no, copia el enlace.
  async function compartir() {
    const datos = { title: evento.titulo, url: window.location.href };

    try {
      if (navigator.share) {
        await navigator.share(datos);
      } else {
        await navigator.clipboard?.writeText(datos.url);
      }
    } catch {
      // La persona canceló el menú de compartir: no hay nada que hacer.
    }
  }

  return (
    <article className="ficha-evento">
      <div className="ancho-home portada-contenedor">
        <nav className="migas-detalle" aria-label={faltantes.migas}>
          <Link to="/">{migas?.inicio}</Link>
          <Icono nombre="chevR" tamano={14} />
          <Link to="/explorar">{migas?.explorar}</Link>
          <Icono nombre="chevR" tamano={14} />
          <span aria-current="page">{evento.titulo}</span>
        </nav>

        <div className="portada-detalle">
          <AficheEvento afiche={evento.afiche} className="afiche-detalle" />

          <button
            type="button"
            className="boton-portada boton-volver"
            aria-label={general?.aria?.volver}
            onClick={volver}
          >
            <Icono nombre="chevL" tamano={18} />
          </button>

          <button
            type="button"
            className="boton-portada boton-compartir"
            aria-label={general?.acciones?.compartir}
            onClick={compartir}
          >
            <Icono nombre="share" tamano={18} />
          </button>
        </div>
      </div>

      <div className="ancho-home cuerpo-detalle">
        <header className="encabezado-detalle">
          <div className="etiquetas-detalle">
            <Etiqueta tono="marca">
              {general?.categorias?.singular?.[evento.categoria] ??
                evento.categoria}
            </Etiqueta>
            <Etiqueta tono="neutro" className="solo-web">
              {edad}
            </Etiqueta>
          </div>

          <div className="titulo-detalle">
            <h1>{evento.titulo}</h1>
            {evento.artistas?.length > 0 && (
              <p className="artistas-detalle">{evento.artistas.join(" · ")}</p>
            )}
          </div>

          <dl className="datos-detalle">
            <div>
              <span className="icono-dato">
                <Icono nombre="calendar" />
              </span>
              <dt>{t?.info?.fecha}</dt>
              <dd>
                {fecha}
                <span className="dato-secundario">{hora}</span>
              </dd>
            </div>

            <div className="solo-web">
              <span className="icono-dato">
                <Icono nombre="clock" />
              </span>
              <dt>{t?.info?.hora}</dt>
              <dd>{hora}</dd>
            </div>

            <div>
              <span className="icono-dato">
                <Icono nombre="pin" />
              </span>
              <dt>{t?.info?.lugar}</dt>
              <dd>
                <span className="solo-web">{lugar}</span>
                <span className="solo-movil">{evento.recinto?.nombre}</span>
                <span className="dato-secundario">{direccion}</span>
              </dd>
            </div>
          </dl>
        </header>

        <nav className="pestanas-detalle" aria-label={t?.pestanas?.descripcion}>
          {pestanas.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={pestana === item.id ? "pestana-activa" : ""}
              aria-current={pestana === item.id ? "true" : undefined}
              onClick={() => setPestana(item.id)}
            >
              {item.texto}
            </a>
          ))}
        </nav>

        <section id="descripcion" className="seccion-detalle">
          <h2>{t?.descripcion?.titulo}</h2>
          <p
            id="texto-descripcion"
            className={
              descripcionLarga && !descripcionCompleta
                ? "descripcion-recortada"
                : ""
            }
          >
            {evento.descripcion}
          </p>
          {descripcionLarga && !descripcionCompleta && (
            <button
              type="button"
              className="leer-mas"
              aria-controls="texto-descripcion"
              aria-expanded="false"
              onClick={() => setDescripcionCompleta(true)}
            >
              {t?.descripcion?.botones?.leerMas}
            </button>
          )}
        </section>

        {evento.funciones?.length > 0 && (
          <section className="seccion-detalle">
            <h2>{faltantes.funciones}</h2>
            <ul className="lista-detalle">
              {evento.funciones.map((funcion) => (
                <li key={funcion.id}>
                  <span className="nombre-item">
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
                  <span className="nombre-item">{localidad.nombre}</span>
                  <strong>{formatoPrecio(localidad.precio)}</strong>
                  <Etiqueta tono={localidad.agotada ? "error" : "exito"}>
                    {textoDisponible(localidad)}
                  </Etiqueta>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="como-llegar" className="seccion-detalle solo-web">
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

        <section id="politicas" className="seccion-detalle solo-web">
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
      </div>
    </article>
  );
}