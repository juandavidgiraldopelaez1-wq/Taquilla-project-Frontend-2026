import "./SelectorIdioma.css";
export default function SelectorIdioma({ idioma, onCambiar, etiqueta }) {
  return (
    <div className="idiomas-home" role="group" aria-label={etiqueta}>
      {["es", "en"].map((valor) => (
        <button
          type="button"
          key={valor}
          lang={valor}
          aria-pressed={idioma === valor}
          onClick={() => onCambiar(valor)}
        >
          {valor.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
