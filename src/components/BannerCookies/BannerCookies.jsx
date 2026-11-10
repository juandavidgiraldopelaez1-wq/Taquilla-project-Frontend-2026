import "./BannerCookies.css";

export default function BannerCookies({
  textos,
  onAceptar,
  onRechazar,
  onConfigurar,
}) {
  return (
    <aside className="banner-cookies" aria-label={textos.banner}>
      <h2>{textos.banner}</h2>

      <p>{textos.descripcion}</p>

      <div className="grupo-botones">
        <button
          type="button"
          className="boton-home"
          onClick={onAceptar}
        >
          {textos.aceptar}
        </button>

        <button
          type="button"
          className="boton-home"
          onClick={onRechazar}
        >
          {textos.rechazar}
        </button>

        <button
          type="button"
          className="enlace-home"
          onClick={onConfigurar}
        >
          {textos.configurar}
        </button>
      </div>
    </aside>
  );
}
