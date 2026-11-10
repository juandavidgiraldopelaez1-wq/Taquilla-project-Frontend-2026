
import EventoDestacado from "../EventoDestacado/EventoDestacado.jsx";
import "./HeroTaquilla.css";

export default function HeroTaquilla({
  en,
  textos,
  children,
  destacado,
  abrirEvento,
  setFiltros,
  filtrarCategoria,
}) {
  const hero = textos?.paginas?.inicio?.hero;
  const categorias = textos?.general?.categorias;

  const temporada =
    hero?.etiquetas?.temporada ??
    (en ? "November – December 2026 season" : "Temporada nov – dic 2026");

  const titulo =
    hero?.titulo ??
    (en ? "Your next night starts here" : "Tu próxima noche empieza aquí");

  const subtitulo =
    hero?.subtitulo ??
    (en
      ? "Concerts, theatre, sports and festivals. Search by category, date or city and discover all the details of each event."
      : "Conciertos, teatro, deportes y festivales. Busca por categoría, fecha o ciudad y consulta todos los detalles de cada evento.");

  const etiquetaPopulares =
    hero?.buscador?.populares ?? (en ? "Popular:" : "Populares:");

  // Las sugerencias conservan sus filtros originales.
  const sugerencias = [
    {
      nombre: "Salsa",
      categoria: null,
    },
    {
      nombre: "Stand-up",
      categoria: "Comedia",
    },
    {
      nombre: categorias?.deportes ?? "Deportes",
      categoria: "Deportes",
    },
    {
      nombre: categorias?.festivales ?? "Festivales",
      categoria: "Festivales",
    },
  ];

  function seleccionarSugerencia(sugerencia) {
    if (!sugerencia.categoria) {
      setFiltros({ consulta: "Salsa" });
      document.getElementById("eventos")?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }

    filtrarCategoria(sugerencia.categoria);
  }

  return (
    <section className="hero-taquilla">
      <div className="ancho-home interior-taquilla">
        <div>
          <span className="etiqueta-evento">
            {temporada}
          </span>

          <h1>{titulo}</h1>

          <p>{subtitulo}</p>

          {children}

          <div className="populares">
            <span>{etiquetaPopulares}</span>

            {sugerencias.map((sugerencia) => (
              <button
                type="button"
                key={sugerencia.nombre}
                onClick={() => seleccionarSugerencia(sugerencia)}
              >
                {sugerencia.nombre}
              </button>
            ))}
          </div>
        </div>

        <EventoDestacado
          evento={destacado}
          en={en}
          textos={textos}
          onAbrir={abrirEvento}
        />
      </div>
    </section>
  );
}
