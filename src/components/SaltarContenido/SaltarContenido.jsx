import "./SaltarContenido.css";
export default function SaltarContenido({ texto, destino = "contenido" }) {
  return (
    <a className="saltar-contenido" href={`#${destino}`}>
      {texto}
    </a>
  );
}
