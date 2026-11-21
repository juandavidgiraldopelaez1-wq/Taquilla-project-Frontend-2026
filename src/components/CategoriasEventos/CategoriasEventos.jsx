import { Link } from "react-router";
import IconoEvento from "../IconoEvento/IconoEvento.jsx";
import { usePreferencias } from "../../hooks/usePreferencias.js";
import { textosFaltantes } from "../../config/textosFaltantes.js";
import { plural } from "../../utils/formato.js";
import { rutaExplorar } from "../../utils/filtros.js";
import "./CategoriasEventos.css";

/**
 * Accesos a las categorías de GET /categorias (Figma: «Categorías»).
 * En web son tarjetas; en móvil, chips con «Todos» al inicio.
 */
export default function CategoriasEventos({ categorias, cargando, textos }) {
  const { idioma } = usePreferencias();
  const nombres = textos?.general?.categorias;
  const cantidades = textos?.paginas?.inicio?.categorias?.eventos;

  return (
    <nav
      className="categorias-eventos"
      aria-label={textosFaltantes[idioma].categorias}
      aria-busy={cargando || undefined}
    >
      <Link className="categoria-todos" to="/explorar">
        {nombres?.todas}
      </Link>
      {categorias.map((categoria) => (
        <Link key={categoria.id} to={rutaExplorar({ categoria: categoria.id })}>
          <span className="icono-categoria">
            <IconoEvento tipo={categoria.id} />
          </span>
          <span>
            {nombres?.[categoria.id] ?? categoria.nombre}
            <small>{plural(cantidades, categoria.eventos ?? 0)}</small>
          </span>
        </Link>
      ))}
    </nav>
  );
}
