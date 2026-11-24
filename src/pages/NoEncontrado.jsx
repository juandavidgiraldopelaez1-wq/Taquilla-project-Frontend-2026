import LayoutPublico from "../components/LayoutPublico/LayoutPublico.jsx";
import Boton from "../components/Boton/Boton.jsx";
import Icono from "../components/Icono/Icono.jsx";
import { usePreferencias } from "../hooks/usePreferencias.js";
import "./NoEncontrado.css";

/**
 * Página de no encontrado (equivalente a notFound() de Next.js).
 * Sin props usa los textos de paginas.noEncontrado (ruta inexistente); el
 * detalle de un evento la usa con los de paginas.detalleEvento.noEncontrado.
 * El título de la pestaña y la descripción salen de paginas.noEncontrado.seo.
 */
export default function NoEncontrado({ titulo, texto, accion }) {
  const { textos } = usePreferencias();
  const pagina = textos?.paginas?.noEncontrado;
  const tituloFinal = titulo ?? pagina?.contenido?.titulo;
  const textoFinal = texto ?? pagina?.contenido?.texto;

  return (
    <LayoutPublico
      titulo={pagina?.seo?.titulo}
      descripcion={pagina?.seo?.descripcion}
    >
      <section className="no-encontrado ancho-home">
        <span className="no-encontrado-icono">
          <Icono nombre="info" tamano={30} />
        </span>
        <h1>{tituloFinal}</h1>
        {textoFinal && <p>{textoFinal}</p>}
        {accion ?? (
          <Boton variante="primario" to="/">
            {pagina?.contenido?.botones?.volverInicio}
          </Boton>
        )}
      </section>
    </LayoutPublico>
  );
}
