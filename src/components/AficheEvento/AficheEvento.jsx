import "./AficheEvento.css";

/**
 * Afiche del evento. No es una foto: se pinta con el degradado de
 * afiche.color1 a afiche.color2 que entrega la API (US-TAQ-S2-01), con los
 * dos círculos translúcidos del diseño de Figma.
 */
export default function AficheEvento({ afiche, className = "" }) {
  const estilo = afiche
    ? { "--afiche-color1": afiche.color1, "--afiche-color2": afiche.color2 }
    : undefined;

  return (
    <div
      className={`afiche-evento ${className}`.trim()}
      style={estilo}
      data-patron={afiche?.patron}
      aria-hidden="true"
    />
  );
}
