import { Link } from "react-router";
import Icono from "../Icono/Icono.jsx";
import "./Marca.css";

/**
 * Logo de Taquilla (Figma: «Logo/Normal» y «Logo/Inverso»).
 * Usar `inverso` sobre fondos oscuros. `etiqueta` es el nombre accesible
 * del enlace al inicio (sale de los textos de la API).
 */
export default function Marca({ nombre, etiqueta, inverso = false }) {
  return (
    <Link
      className={`marca ${inverso ? "marca--inverso" : ""}`.trim()}
      to="/"
      aria-label={etiqueta}
    >
      <span className="marca-emblema">
        <Icono nombre="ticket" tamano={18} />
      </span>
      {nombre}
    </Link>
  );
}
