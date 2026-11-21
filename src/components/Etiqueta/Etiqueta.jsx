import "./Etiqueta.css";

/**
 * Etiqueta corta (Figma: «Etiqueta»).
 * tono: "neutro" | "marca" | "exito" | "alerta" | "error" | "inverso".
 * Los tonos de estado se pintan con un punto de color y texto principal.
 */
export default function Etiqueta({
  tono = "neutro",
  className = "",
  children,
}) {
  return (
    <span className={`etiqueta etiqueta--${tono} ${className}`.trim()}>
      {children}
    </span>
  );
}
