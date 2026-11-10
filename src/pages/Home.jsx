
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
  const { idioma } = usePreferencias();
  const en = idioma === "en";
  const t = interfaz[idioma];

  const { detalle, setDetalle, abrirCuenta } = useDetalle(idioma);

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

  // Obtener los eventos destacados para el Hero y la sección principal.
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
    setDetalle({
      titulo: evento.nombre,
      descripcion: `${evento.horario} · ${evento.lugar}, ${evento.ciudad}`,
      contenido: (
        <div className="resumen-evento">
          <AficheEvento variante={evento.arte} />

          <p>{dinero(evento.precio)} COP</p>

          {evento.original?.disponibilidad && (
            <small>
              {en
                ? `${evento.original.disponibilidad.disponibles} tickets available`
                : `${evento.original.disponibilidad.disponibles} entradas disponibles`}
            </small>
          )}
        </div>
      ),
      cerrar: en ? "Close" : "Cerrar",
    });
  }

  // Reintentar las consultas que hayan presentado errores.
  function reintentarCargas() {
    if (errorCategorias) recargarCategorias();
    if (errorCatalogo) recargarCatalogo();
    if (errorDestacados) recargarDestacados();
  }

  const hayErrores = errorCategorias || errorCatalogo || errorDestacados;

  return (
    <LayoutPublico
      destino="#eventos"
      etiqueta={t.explora}
      descripcion={t.descripcionHome}
      onCuenta={abrirCuenta}
    >
      <HeroTaquilla
        en={en}
        destacado={destacados[0] ?? null}
        abrirEvento={abrirEvento}
        setFiltros={setFiltros}
        filtrarCategoria={filtrarCategoria}
      >
        <BuscadorEventos
          en={en}
          eventos={eventos}
          onBuscar={buscar}
          filtrosAplicados={filtros}
        />
      </HeroTaquilla>

      <div className="ancho-home">
        {hayErrores && (
          <div role="alert">
            <p>
              {en
                ? "Some information could not be loaded from the server."
                : "No pudimos cargar toda la información del servidor."}
            </p>

            <button
              type="button"
              className="boton-home"
              onClick={reintentarCargas}
            >
              {en ? "Retry" : "Reintentar"}
            </button>
          </div>
        )}

        {cargandoCategorias && (
          <p role="status">
            {en ? "Loading categories..." : "Cargando categorías..."}
          </p>
        )}

        <CategoriasEventos
          categorias={categorias}
          categoriasEn={categoriasEn}
          cantidades={cantidades}
          filtros={filtros}
          en={en}
          filtrarCategoria={filtrarCategoria}
        />

        {cargandoDestacados && !filtros && (
          <p role="status">
            {en
              ? "Loading featured events..."
              : "Cargando eventos destacados..."}
          </p>
        )}

        {!cargandoDestacados && (
          <SeccionEventos
            id="eventos"
            titulo={
              filtros
                ? t.resultadosBusqueda
                : t.destacadosSemana
            }
            tituloMovil={en ? "Highlights" : "Destacados"}
            descripcion={
              filtros
                ? `${resultados.length} ${t.resultados}`
                : t.descripcionDestacadosSemana
            }
            eventos={filtros ? resultados : destacados.slice(0, 4)}
            en={en}
            onAbrir={abrirEvento}
            onVerTodos={() => buscar({})}
          />
        )}

        {cargandoCatalogo && (
          <p role="status">
            {en ? "Loading event catalog..." : "Cargando catálogo de eventos..."}
          </p>
        )}

        {!filtros && !cargandoCatalogo && !errorCatalogo && (
          <SeccionEventos
            id="eventos-ciudad"
            titulo={t.proximamenteManizales}
            tituloMovil={en ? "This weekend" : "Este fin de semana"}
            descripcion={t.descripcionProximamenteManizales}
            eventos={eventos.filter(
              (evento) => evento.ciudad === "Manizales",
            )}
            en={en}
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
