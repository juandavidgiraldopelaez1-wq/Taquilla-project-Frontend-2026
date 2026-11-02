
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

import {
  eventos,
  categorias as categoriasLocales,
  categoriasEn,
  dinero,
} from "../data/catalogo.js";

import { interfaz } from "../data/interfaz.js";

export default function Home() {
  const { idioma } = usePreferencias();
  const en = idioma === "en";
  const t = interfaz[idioma];

  const { detalle, setDetalle, abrirCuenta } = useDetalle(idioma);

  // Consulta las categorías reales de la API.
  const {
    datos: respuestaCategorias,
    cargando: cargandoCategorias,
    error: errorCategorias,
    recargar: recargarCategorias,
  } = useRecurso("/categorias");

  // Los filtros de eventos siguen utilizando temporalmente
  // el catálogo local. La conexión de eventos será otro cambio.
  const {
    filtros,
    resultados,
    buscar,
    setFiltros,
    filtrarCategoria,
  } = useEventos(eventos);

  // Obtener las categorías devueltas por la API.
  const categoriasApi = Array.isArray(respuestaCategorias?.datos)
    ? respuestaCategorias.datos
    : [];

  // Utilizar las categorías locales mientras llega la respuesta.
  const categorias =
    categoriasApi.length > 0
      ? categoriasApi.map((categoria) => categoria.nombre)
      : categoriasLocales;

  // Obtener las cantidades reales de eventos por categoría.
  const cantidades = categorias.map((nombre) => {
    const categoriaApi = categoriasApi.find(
      (categoria) => categoria.nombre === nombre
    );

    return categoriaApi?.eventos ?? (cargandoCategorias ? "…" : "—");
  });

  function abrirEvento(evento) {
    setDetalle({
      titulo: evento.nombre,
      descripcion: `${evento.horario} · ${evento.lugar}, ${evento.ciudad}`,
      contenido: (
        <div className="resumen-evento">
          <AficheEvento variante={evento.arte} />

          <p>{dinero(evento.precio)} COP</p>

          <small>
            {en
              ? "Sample event. Tickets are not for sale."
              : "Evento de ejemplo. No hay venta de entradas."}
          </small>
        </div>
      ),
      cerrar: en ? "Close" : "Cerrar",
    });
  }

  return (
    <LayoutPublico
      destino="#eventos"
      etiqueta={t.explora}
      descripcion={t.descripcionHome}
      onCuenta={abrirCuenta}
    >
      <HeroTaquilla
        en={en}
        destacado={eventos[1]}
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
        {errorCategorias && (
          <div role="alert">
            <p>
              {en
                ? "Categories could not be loaded."
                : "No se pudieron cargar las categorías desde el servidor."}
            </p>

            <button
              type="button"
              className="boton-home"
              onClick={recargarCategorias}
            >
              {en ? "Retry" : "Reintentar"}
            </button>
          </div>
        )}

        <CategoriasEventos
          categorias={categorias}
          categoriasEn={categoriasEn}
          cantidades={cantidades}
          filtros={filtros}
          en={en}
          filtrarCategoria={filtrarCategoria}
        />

        <SeccionEventos
          id="eventos"
          titulo={
            filtros
              ? t.resultadosBusqueda
              : t.destacadosSemana
          }
          descripcion={
            filtros
              ? `${resultados.length} ${t.resultados}`
              : t.descripcionDestacadosSemana
          }
          eventos={filtros ? resultados : eventos.slice(0, 4)}
          en={en}
          onAbrir={abrirEvento}
          onVerTodos={() => buscar({})}
        />

        {!filtros && (
          <SeccionEventos
            id="eventos-ciudad"
            titulo={t.proximamenteManizales}
            descripcion={t.descripcionProximamenteManizales}
            eventos={eventos.filter(
              (evento) => evento.ciudad === "Manizales"
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
