// Utilidades de formato. No contienen textos: las plantillas llegan de la API
// (GET /textos) y aquí solo se reemplazan sus variables.

const ZONA_HORARIA = "America/Bogota";

/** Reemplaza {variable} en una plantilla de la API. */
export function interpolar(plantilla, valores = {}) {
  if (typeof plantilla !== "string") return "";
  return Object.entries(valores).reduce(
    (texto, [clave, valor]) => texto.replaceAll(`{${clave}}`, String(valor)),
    plantilla,
  );
}

/** Elige la forma singular u plural ({ uno, otro }) e interpola la cantidad. */
export function plural(plantillas, cantidad, valores = {}) {
  const plantilla = Number(cantidad) === 1 ? plantillas?.uno : plantillas?.otro;
  return interpolar(plantilla, { cantidad, ...valores });
}

function capitalizar(texto) {
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : "";
}

/**
 * Precio en pesos colombianos con el formato de Figma: $95.000.
 * Los datos del catálogo no se traducen, por eso siempre usa es-CO.
 */
export function formatoPrecio(valor) {
  if (!Number.isFinite(Number(valor))) return "";
  return `$${Number(valor).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
}

function locale(idioma) {
  return idioma === "en" ? "en-US" : "es-CO";
}

/** «Sáb 14 nov» */
export function formatoFecha(fecha, idioma) {
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return "";
  const partes = new Intl.DateTimeFormat(locale(idioma), {
    timeZone: ZONA_HORARIA,
    weekday: "short",
    day: "numeric",
    month: "short",
  })
    .format(valor)
    .replaceAll(".", "")
    .replace(",", "");
  return capitalizar(partes);
}

/** «8:00 p. m.» / «8:00 PM» */
export function formatoHora(fecha, idioma) {
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return "";
  return new Intl.DateTimeFormat(locale(idioma), {
    timeZone: ZONA_HORARIA,
    hour: "numeric",
    minute: "2-digit",
  }).format(valor);
}

/** Une fecha y hora con la plantilla general.formatos.fechaYHora. */
export function formatoFechaHora(fecha, idioma, plantilla) {
  return interpolar(plantilla, {
    fecha: formatoFecha(fecha, idioma),
    hora: formatoHora(fecha, idioma),
  });
}

/** Fecha larga para el detalle: «sábado, 14 de noviembre de 2026». */
export function formatoFechaLarga(fecha, idioma) {
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return "";
  return capitalizar(
    new Intl.DateTimeFormat(locale(idioma), {
      timeZone: ZONA_HORARIA,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(valor),
  );
}

/** Fecha local en formato AAAA-MM-DD (para filtros desde/hasta). */
export function fechaISO(fecha = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_HORARIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(fecha);
}

/** Iniciales para el avatar: «Laura Castaño» → «LC». */
export function iniciales(nombre = "") {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
}
