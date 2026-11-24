import { useEffect, useRef } from "react";
import Boton from "../Boton/Boton.jsx";
import "./BannerCookies.css";

/**
 * Aviso de cookies (Figma: «Aviso de cookies»). Aceptar y Rechazar tienen el
 * mismo tamaño y el mismo peso visual. Textos: textos.cookies.banner.
 * Con «enfocar» (aviso reabierto desde el pie) el foco pasa al aviso para
 * que el teclado y el lector de pantalla lleguen a él.
 */
export default function BannerCookies({
  textos,
  onAceptar,
  onRechazar,
  enfocar = false,
}) {
  const avisoRef = useRef(null);

  useEffect(() => {
    if (enfocar) avisoRef.current?.focus();
  }, [enfocar]);

  return (
    <aside
      ref={avisoRef}
      tabIndex={-1}
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
