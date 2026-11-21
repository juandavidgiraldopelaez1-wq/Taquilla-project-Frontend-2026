import { Link } from "react-router";
import EventoDestacado from "../EventoDestacado/EventoDestacado.jsx";
import Etiqueta from "../Etiqueta/Etiqueta.jsx";
import { rutaExplorar } from "../../utils/filtros.js";
import "./HeroTaquilla.css";

// Cantidad de accesos rápidos en «Populares» (Figma muestra cuatro).
const POPULARES = 4;

export default function HeroTaquilla({
  textos,
  destacado,
  categorias,
  children,
}) {
  const hero = textos?.paginas?.inicio?.hero;
  const nombres = textos?.general?.categorias;

  // «Populares»: las categorías con más eventos según GET /categorias.
  const populares = [...categorias]
    .sort((a, b) => (b.eventos ?? 0) - (a.eventos ?? 0))
    .slice(0, POPULARES);

  return (
    <section className="hero-taquilla">
      <div className="ancho-home interior-taquilla">
        <div>
          {hero?.etiquetas?.temporada && (
            <Etiqueta tono="marca">{hero.etiquetas.temporada}</Etiqueta>
          )}
          <h1>{hero?.titulo}</h1>
          <p>{hero?.subtitulo}</p>

          {children}

          {populares.length > 0 && (
            <div className="populares">
              <span>{hero?.buscador?.populares}</span>
              {populares.map((categoria) => (
                <Link
                  key={categoria.id}
                  to={rutaExplorar({ categoria: categoria.id })}
                >
                  {nombres?.[categoria.id] ?? categoria.nombre}
                </Link>
              ))}
            </div>
          )}
        </div>

        <EventoDestacado evento={destacado} textos={textos} />
      </div>
    </section>
  );
}
