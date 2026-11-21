import "./BannerCookies.css";
import Boton from "../Boton/Boton.jsx";

export default function BannerCookies({ textos, onAceptar, onRechazar }) {
  return (
    <aside className="banner-cookies" aria-label={textos.banner}>
      <div className="banner-cookies-contenido">
        <h2>{textos.banner}</h2>
        <p>{textos.descripcion}</p>
      </div>

      <div className="banner-cookies-acciones">
        <Boton variante="secundario" onClick={onRechazar}>
          {textos.rechazar}
        </Boton>

        <Boton variante="primario" onClick={onAceptar}>
          {textos.aceptar}
        </Boton>
      </div>
    </aside>
  );
}
