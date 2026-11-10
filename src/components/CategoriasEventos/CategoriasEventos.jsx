
import IconoEvento from "../IconoEvento/IconoEvento.jsx";
import "./CategoriasEventos.css";

export default function CategoriasEventos({
  categorias,
  categoriasApi = [],
  categoriasEn = [],
  cantidades,
  filtros,
  en,
  textos,
  filtrarCategoria,
}) {
  const textosCategorias = textos?.general?.categorias;
  const textosInicio = textos?.paginas?.inicio?.categorias;

  function obtenerCantidad(cantidad) {
    const numero = Number(cantidad ?? 0);

    const plantilla =
      numero === 1
        ? textosInicio?.eventos?.uno
        : textosInicio?.eventos?.otro;

    if (plantilla) {
      return plantilla.replace("{cantidad}", String(numero));
    }

    return `${numero} ${numero === 1
      ? (en ? "event" : "evento")
      : (en ? "events" : "eventos")}`;
  }

  function obtenerNombre(categoria, indice) {
    const id = categoriasApi[indice]?.id;

    return (
      textosCategorias?.[id] ??
      (en ? categoriasEn[indice] : categoria) ??
      categoria
    );
  }

  return (
    <nav
      className="categorias-eventos"
      aria-label={en ? "Event categories" : "Categorías de eventos"}
    >
      <button
        type="button"
        className="categoria-todos"
        aria-pressed={!filtros?.categoria}
        onClick={() => filtrarCategoria("")}
      >
        {textosCategorias?.todas ?? (en ? "All" : "Todos")}
      </button>

      {categorias.map((categoria, indice) => {
        const nombre = obtenerNombre(categoria, indice);
        const cantidad = cantidades[indice];

        return (
          <button
            type="button"
            key={categoriasApi[indice]?.id ?? categoria}
            aria-pressed={filtros?.categoria === categoria}
            onClick={() => filtrarCategoria(categoria)}
          >
            <span className="icono-categoria">
              <IconoEvento tipo={categoria} />
            </span>

            <span>
              {nombre}
              <small>{obtenerCantidad(cantidad)}</small>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
