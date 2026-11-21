import Icono from "../Icono/Icono.jsx";
import "./IconoEvento.css";

// Relación entre el tipo de dato o el id de categoría de la API y el ícono
// de Figma que lo representa.
const ICONO_POR_TIPO = {
  buscar: "search",
  lugar: "pin",
  fecha: "calendar",
  hora: "clock",
  conciertos: "music",
  teatro: "star",
  deportes: "trophy",
  festivales: "flag",
  comedia: "smile",
  familiares: "users",
};

export default function IconoEvento({ tipo, tamano = 20 }) {
  const nombre = ICONO_POR_TIPO[String(tipo).toLowerCase()] ?? "calendar";

  return <Icono nombre={nombre} tamano={tamano} />;
}
