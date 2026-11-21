import Icono from "../Icono/Icono.jsx";
import "./Aviso.css";

const ICONOS = { error: "alerta", exito: "checkCirculo", informacion: "info" };

/**
 * Mensaje de estado dentro de un formulario (Figma: «Aviso»). Siempre lleva
 * ícono y texto. El de error usa role="alert"; los demás, role="status".
 */
export default function Aviso({ tipo = "error", titulo, texto, children }) {
  return (
    <div
      className={`aviso aviso--${tipo}`}
      role={tipo === "error" ? "alert" : "status"}
    >
      <Icono nombre={ICONOS[tipo]} />
      <div className="aviso-contenido">
        {titulo && <p className="aviso-titulo">{titulo}</p>}
        {texto && <p className="aviso-texto">{texto}</p>}
        {children}
      </div>
    </div>
  );
}
