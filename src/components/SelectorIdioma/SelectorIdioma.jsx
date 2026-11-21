import { usePreferencias } from "../../hooks/usePreferencias.js";
import "./SelectorIdioma.css";

/**
 * Selector ES | EN (Figma: «Selector de idioma»). Los idiomas salen de
 * GET /idiomas y los códigos visibles de textos.idioma.
 */
export default function SelectorIdioma({ idiomas = [] }) {
  const { idioma, cambiarIdioma, textos } = usePreferencias();
  const t = textos?.idioma;
  const codigos = { es: t?.codigoEs, en: t?.codigoEn };

  return (
    <div
      className="idiomas-home"
      role="group"
      aria-label={textos?.navbar?.aria?.idioma}
    >
      {idiomas.map(({ codigo, nombre }) => (
        <button
          type="button"
          key={codigo}
          lang={codigo}
          aria-pressed={idioma === codigo}
          aria-label={nombre}
          onClick={() => cambiarIdioma(codigo)}
        >
          {codigos[codigo] ?? codigo.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
