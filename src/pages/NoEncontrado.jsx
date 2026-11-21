import LayoutPublico from "../components/LayoutPublico/LayoutPublico.jsx";
import Boton from "../components/Boton/Boton.jsx";
import Icono from "../components/Icono/Icono.jsx";
import { usePreferencias } from "../hooks/usePreferencias.js";
import "./NoEncontrado.css";

/**
 * Página de no encontrado (equivalente a notFound() de Next.js).
 * Sin props muestra el mensaje de ruta inexistente; el detalle de un evento
 * la usa con los textos de paginas.detalleEvento.noEncontrado.
 */
export default function NoEncontrado({ titulo, texto, accion }) {
  const { textos } = usePreferencias();
  const tituloFinal = titulo ?? textos?.errores?.ruta_no_encontrada;

  return (
    <LayoutPublico titulo={tituloFinal}>
      <section className="no-encontrado ancho-home">
        <span className="no-encontrado-icono">
          <Icono nombre="info" tamano={30} />
        </span>
        <h1>{tituloFinal}</h1>
        {(texto ?? textos?.errores?.no_encontrado) && (
          <p>{texto ?? textos?.errores?.no_encontrado}</p>
        )}
        {accion ?? (
          <Boton variante="primario" to="/explorar">
            {textos?.paginas?.detalleEvento?.noEncontrado?.botones?.volver}
          </Boton>
        )}
      </section>
    </LayoutPublico>
  );
}
