import Boton from "../Boton/Boton.jsx";
import "./BannerCookies.css";

/**
 * Aviso de cookies (Figma: «Aviso de cookies»). Aceptar y Rechazar tienen el
 * mismo tamaño y el mismo peso visual. Textos: textos.cookies.banner.
 */
export default function BannerCookies({ textos, onAceptar, onRechazar }) {
  return (
    <aside
      className="banner-cookies"
      aria-labelledby="banner-cookies-titulo"
      aria-describedby="banner-cookies-texto"
    >
      <div className="banner-cookies-contenido">
        <h2 id="banner-cookies-titulo">{textos?.titulo}</h2>
        <p id="banner-cookies-texto">{textos?.texto}</p>
      </div>
      <div className="banner-cookies-acciones">
        <Boton variante="secundario" onClick={onRechazar}>
          {textos?.botones?.rechazar}
        </Boton>
        <Boton variante="primario" onClick={onAceptar}>
          {textos?.botones?.aceptar}
        </Boton>
      </div>
    </aside>
  );
}
