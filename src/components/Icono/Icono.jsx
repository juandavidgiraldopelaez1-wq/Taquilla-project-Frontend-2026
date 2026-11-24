import "./Icono.css";

// Íconos exportados de Figma («Imágenes para exportar»). Cada archivo se
// carga como URL y se pinta con mask-image, así toma el color del texto
// (currentColor) y funciona con hover, estados y alto contraste.
const archivos = import.meta.glob("../../assets/iconos/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const iconos = Object.fromEntries(
  Object.entries(archivos).map(([ruta, url]) => [
    ruta.split("/").pop().replace(".svg", ""),
    url,
  ]),
);

/**
 * nombre: nombre del archivo en src/assets/iconos (sin .svg).
 * tamano: lado en píxeles (por defecto 20, como la mayoría en Figma).
 * Es decorativo (aria-hidden): el texto accesible va en el control que lo usa.
 */
export default function Icono({ nombre, tamano = 20, className = "" }) {
  const url = iconos[nombre];

  if (!url) return null;

  return (
    <i
      className={`icono ${className}`.trim()}
      aria-hidden="true"
      style={{
        "--icono-url": `url("${url}")`,
        "--icono-tamano": `${tamano}px`,
      }}
    />
  );
}
