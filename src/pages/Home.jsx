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
import { eventos, categorias, categoriasEn, dinero } from "../data/catalogo.js";

export default function Home() {
  const { idioma } = usePreferencias();
  const en = idioma === "en";
  const { detalle, setDetalle, abrirCuenta } = useDetalle(idioma);
  const { filtros, resultados, buscar, setFiltros, filtrarCategoria } =
    useEventos(eventos);
  const cantidades = categorias.map(
    (categoria) =>
      eventos.filter((evento) => evento.categoria === categoria).length,
  );
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
      etiqueta={en ? "Explore" : "Explorar"}
      descripcion={
        en
          ? "Concerts, theatre, sports and festivals in one place."
          : "Conciertos, teatro, deportes y festivales en un solo lugar."
      }
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
              ? en
                ? "Search results"
                : "Resultados de búsqueda"
              : en
                ? "Featured events"
                : "Eventos destacados"
          }
          descripcion={
            filtros
              ? `${resultados.length} ${en ? "results" : "resultados"}`
              : en
                ? "Explore our event selection"
                : "Explora nuestra selección de eventos"
          }
          eventos={filtros ? resultados : eventos.slice(0, 4)}
          en={en}
          onAbrir={abrirEvento}
          onVerTodos={() => buscar({})}
        />
        {!filtros && (
          <SeccionEventos
            id="eventos-ciudad"
            titulo={en ? "Events in Manizales" : "Eventos en Manizales"}
            descripcion={
              en
                ? "Discover events in your city"
                : "Descubre los eventos de tu ciudad"
            }
            eventos={eventos.filter((evento) => evento.ciudad === "Manizales")}
            en={en}
            onAbrir={abrirEvento}
            onVerTodos={() => buscar({ ciudad: "Manizales" })}
          />
        )}
      </div>
      <DialogoDetalle detalle={detalle} onCerrar={() => setDetalle(null)} />
    </LayoutPublico>
  );
}
