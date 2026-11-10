
import "./BannerCookies.css";

export default function BannerCookies({
  textos,
  onAceptar,
  onRechazar,
}) {
  return (
    <aside className="banner-cookies" aria-label={textos.banner}>
      <div className="banner-cookies-contenido">
        <h2>{textos.banner}</h2>
        <p>{textos.descripcion}</p>
      </div>

      <div className="banner-cookies-acciones">
        <button
          type="button"
          className="boton-home secundario"
          onClick={onRechazar}
        >
          {textos.rechazar}
        </button>

        <button
          type="button"
          className="boton-home primario"
          onClick={onAceptar}
        >
          {textos.aceptar}
        </button>
      </div>
    </aside>
  );
}
