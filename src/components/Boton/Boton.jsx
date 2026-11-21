import { Link } from "react-router";
import "./Boton.css";

/**
 * Botón del sistema de diseño (Figma: «Botón»).
 * variante: "primario" | "secundario" | "fantasma" | "inverso"
 * tamano: "m" (40 px) | "g" (52 px)
 * Con la prop `to` se pinta como enlace de React Router con el mismo estilo.
 */
export default function Boton({
  variante = "primario",
  tamano = "m",
  to,
  type = "button",
  className = "",
  children,
  ...props
}) {
  const clases =
    `boton boton--${variante} boton--${tamano} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={clases} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={clases} {...props}>
      {children}
    </button>
  );
}
