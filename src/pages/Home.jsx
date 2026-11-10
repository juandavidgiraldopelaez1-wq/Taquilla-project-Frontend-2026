
import { useEffect } from "react";

import LayoutPublico from "../components/LayoutPublico/LayoutPublico.jsx";
import HeroTaquilla from "../components/HeroTaquilla/HeroTaquilla.jsx";
import BuscadorEventos from "../components/BuscadorEventos/BuscadorEventos.jsx";
import CategoriasEventos from "../components/CategoriasEventos/CategoriasEventos.jsx";
import SeccionEventos from "../components/SeccionEventos/SeccionEventos.jsx";
import AficheEvento from "../components/AficheEvento/AficheEvento.jsx";
import DialogoDetalle from "../components/DialogoDetalle/DialogoDetalle.jsx";

import { usePreferencias } from "../context/PreferenciasContext.jsx";
import { useDetalle } from "../hooks/useDetalle.js";
import { useEventos } from "../hooks/useEventos.js";
import { useRecurso } from "../hooks/useRecurso.js";

import { categoriasEn, dinero } from "../data/catalogo.js";
import { interfaz } from "../data/interfaz.js";

// Sustituye variables dinámicas de los textos de la API.
function interpolar(texto, valores = {}) {
  if (!texto) return "";

  return Object.entries(valores).reduce(
    (resultado, [clave, valor]) =>
      resultado.replaceAll(`{${clave}}`, String(valor)),
    texto,
  );
}

function textoCantidad(plantillas, cantidad, fallback) {
  const plantilla =
    Number(cantidad) === 1 ? plantillas?.uno : plantillas?.otro;

  return plantilla
    ? interpolar(plantilla, { cantidad })
    : fallback;
}

// Convierte la fecha de la API a fecha local de Colombia.
function fechaLocal(fecha) {
  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(valor);
}

// Convierte la fecha a un formato legible según el idioma.
function horarioEvento(fecha, idioma) {
  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) return "";

  return new Intl.DateTimeFormat(
    idioma === "en" ? "en-US" : "es-CO",
    {
      timeZone: "America/Bogota",
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(valor);
}

// Adapta los eventos de la API al formato de los componentes existentes.
function adaptarEvento(evento, categoriasApi, idioma, indice) {
  const categoriaApi = categoriasApi.find(
    (categoria) => categoria.id === evento.categoria,
  );

  return {
    id: evento.id,
    slug: evento.slug,
    nombre: evento.titulo,
    categoria: categoriaApi?.nombre || evento.categoria,
    etiqueta: categoriaApi?.nombre || evento.categoria,
    fecha: fechaLocal(evento.fecha),
    horario: horarioEvento(evento.fecha, idioma),
    lugar: evento.recinto?.nombre || "",
    ciudad: evento.recinto?.ciudad || "",
    precio: evento.precioDesde ?? 0,
    arte: indice % 8,
    afiche: evento.afiche,
    original: evento,
  };
}

export default function Home() {
  const { idioma, textos } = usePreferencias();

  const en = idioma === "en";
  const t = interfaz[idioma] || interfaz.es;

  const inicio = textos?.paginas?.inicio;
  const general = textos?.general;

  const { detalle, setDetalle, abrirCuenta } = useDetalle(idioma);

  // Actualiza los metadatos de inicio con los textos de la API.
  useEffect(() => {
    if (inicio?.seo?.titulo) {
      document.title = inicio.seo.titulo;
    }
  }, [inicio?.seo?.titulo]);

  // Obtener categorías de la API.
  const {
    datos: respuestaCategorias,
    cargando: cargandoCategorias,
    error: errorCategorias,
    recargar: recargarCategorias,
  } = useRecurso("/categorias");

  // Obtener el catálogo completo para búsquedas y filtros.
  const {
    datos: respuestaCatalogo,
    cargando: cargandoCatalogo,
    error: errorCatalogo,
    recargar: recargarCatalogo,
  } = useRecurso("/eventos?pagina=1&porPagina=100");

  // Obtener los eventos destacados.
  const {
    datos: respuestaDestacados,
    cargando: cargandoDestacados,
    error: errorDestacados,
    recargar: recargarDestacados,
  } = useRecurso("/eventos/destacados");

  // Validar las respuestas de la API.
  const categoriasApi = Array.isArray(respuestaCategorias?.datos)
    ? respuestaCategorias.datos
    : [];

  const eventosApi = Array.isArray(respuestaCatalogo?.datos)
    ? respuestaCatalogo.datos
    : [];

  const destacadosApi = Array.isArray(respuestaDestacados?.datos)
    ? respuestaDestacados.datos
    : [];

  // Adaptar los eventos al formato que utilizan las tarjetas.
  const eventos = eventosApi.map((evento, indice) =>
    adaptarEvento(evento, categoriasApi, idioma, indice),
  );

  const destacados = destacadosApi.map((evento, indice) =>
    adaptarEvento(evento, categoriasApi, idioma, indice),
  );

  // Mantener el sistema de búsqueda y filtros existente.
  const {
    filtros,
    resultados,
    buscar,
    setFiltros,
    filtrarCategoria,
  } = useEventos(eventos);

  // Obtener las categorías y cantidades reales.
  const categorias = categoriasApi.map(
    (categoria) => categoria.nombre,
  );

  const cantidades = categoriasApi.map(
    (categoria) => categoria.eventos ?? 0,
  );

  // Mostrar el detalle del evento seleccionado.
  function abrirEvento(evento) {
    const original = evento.original;
    const disponibilidad = original?.disponibilidad?.disponibles;

    const formatoLugar = interpolar(
      general?.formatos?.lugarYCiudad,
      {
        lugar: evento.lugar,
        ciudad: evento.ciudad,
      },
    );

    const descripcion =
      general?.formatos?.fechaYLugar
        ? interpolar(general.formatos.fechaYLugar, {
          fecha: evento.horario,
          lugar: formatoLugar,
        })
        : `${evento.horario} · ${formatoLugar || evento.lugar}`;

    const plantillaEntradas =
      disponibilidad === 1
        ? general?.formatos?.entradas?.uno
        : general?.formatos?.entradas?.otro;

    const textoDisponibilidad = plantillaEntradas
      ? interpolar(plantillaEntradas, {
        cantidad: disponibilidad,
      })
      : en
        ? `${disponibilidad} tickets available`
        : `${disponibilidad} entradas disponibles`;

    setDetalle({
      titulo: evento.nombre,
      descripcion,
      contenido: (
        <div className="resumen-evento">
          <AficheEvento variante={evento.arte} />

          <p>{dinero(evento.precio)} COP</p>

          {disponibilidad !== undefined && (
            <small>{textoDisponibilidad}</small>
          )}
        </div>
      ),
      cerrar:
        general?.acciones?.cerrar ?? (en ? "Close" : "Cerrar"),
    });
  }

  // Reintentar las consultas que hayan presentado errores.
  function reintentarCargas() {
    if (errorCategorias) recargarCategorias();
    if (errorCatalogo) recargarCatalogo();
    if (errorDestacados) recargarDestacados();
  }

  const hayErrores =
    errorCategorias || errorCatalogo || errorDestacados;

  const estadoCarga =
    textos?.estados?.cargando?.indicador ??
    (en ? "Loading..." : "Cargando...");

  const textoError =
    textos?.estados?.error?.texto ??
    (en
      ? "Some information could not be loaded from the server."
      : "No pudimos cargar toda la información del servidor.");

  const textoReintentar =
    textos?.estados?.error?.botones?.reintentar ??
    general?.acciones?.reintentar ??
    (en ? "Retry" : "Reintentar");

  const tituloResultados =
    filtros
      ? textoCantidad(
        textos?.paginas?.explorar?.resultadosCorto,
        resultados.length,
        `${resultados.length} ${en ? "events" : "eventos"}`,
      )
      : inicio?.destacados?.titulo ?? t.destacadosSemana;

  const descripcionResultados =
    filtros
      ? textoCantidad(
        textos?.paginas?.explorar?.resultados,
        resultados.length,
        `${resultados.length} ${en ? "events match your filters" : "eventos coinciden con tus filtros"
        }`,
      )
      : inicio?.destacados?.subtitulo ??
      t.descripcionDestacadosSemana;

  const tituloProximos = interpolar(
    inicio?.proximos?.titulo,
    { ciudad: "Manizales" },
  ) || t.proximamenteManizales;

  return (
    <LayoutPublico
      destino="#eventos"
      etiqueta={textos?.navbar?.enlaces?.explorar ?? t.explora}
      descripcion={inicio?.seo?.descripcion ?? t.descripcionHome}
      onCuenta={abrirCuenta}
    >
      <HeroTaquilla
        en={en}
        textos={textos}
        destacado={destacados[0] ?? null}
        abrirEvento={abrirEvento}
        setFiltros={setFiltros}
        filtrarCategoria={filtrarCategoria}
      >
        <BuscadorEventos
          en={en}
          textos={textos}
          eventos={eventos}
          onBuscar={buscar}
          filtrosAplicados={filtros}
        />
      </HeroTaquilla>

      <div className="ancho-home">
        {hayErrores && (
          <div role="alert">
            <p>{textoError}</p>

            <button
              type="button"
              className="boton-home"
              onClick={reintentarCargas}
            >
              {textoReintentar}
            </button>
          </div>
        )}

        {cargandoCategorias && (
          <p role="status">{estadoCarga}</p>
        )}

        <CategoriasEventos
          categorias={categorias}
          categoriasApi={categoriasApi}
          categoriasEn={categoriasEn}
          cantidades={cantidades}
          filtros={filtros}
          en={en}
          textos={textos}
          filtrarCategoria={filtrarCategoria}
        />

        {cargandoDestacados && !filtros && (
          <p role="status">{estadoCarga}</p>
        )}

        {!cargandoDestacados && (
          <SeccionEventos
            id="eventos"
            titulo={tituloResultados}
            tituloMovil={
              inicio?.filtrosMovil?.destacados ??
              (en ? "Highlights" : "Destacados")
            }
            descripcion={descripcionResultados}
            eventos={filtros ? resultados : destacados.slice(0, 4)}
            vistaCompleta={Boolean(filtros)}
            en={en}
            textos={textos}
            onAbrir={abrirEvento}
            onVerTodos={() => buscar({})}
          />
        )}

        {cargandoCatalogo && (
          <p role="status">{estadoCarga}</p>
        )}

        {!filtros && !cargandoCatalogo && !errorCatalogo && (
          <SeccionEventos
            id="eventos-ciudad"
            titulo={tituloProximos}
            tituloMovil={
              inicio?.filtrosMovil?.finDeSemana ??
              (en ? "This weekend" : "Este fin de semana")
            }
            descripcion={
              inicio?.proximos?.subtitulo ??
              t.descripcionProximamenteManizales
            }
            eventos={eventos.filter(
              (evento) => evento.ciudad === "Manizales",
            )}
            en={en}
            textos={textos}
            onAbrir={abrirEvento}
            onVerTodos={() => buscar({ ciudad: "Manizales" })}
          />
        )}
      </div>

      <DialogoDetalle
        detalle={detalle}
        onCerrar={() => setDetalle(null)}
      />
    </LayoutPublico>
  );
}
