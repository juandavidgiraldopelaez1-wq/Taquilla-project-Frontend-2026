// Cookies del sitio con los nombres que piden las historias:
// «consentimiento» (US-TAQ-S1-06) e «idioma» (US-TAQ-S1-05).
const nombre = (clave) => clave;

// Seis meses en segundos.
const DURACION = 60 * 60 * 24 * 180;

export function leerCookie(clave) {
  const prefijo = `${nombre(clave)}=`;
  const cookie = document.cookie
    .split("; ")
    .find((valor) => valor.startsWith(prefijo));
  try {
    return cookie ? decodeURIComponent(cookie.slice(prefijo.length)) : null;
  } catch {
    return null;
  }
}

export function guardarCookie(clave, valor) {
  document.cookie = `${nombre(clave)}=${encodeURIComponent(valor)}; Path=/; Max-Age=${DURACION}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  if (leerCookie(clave) !== valor) throw new Error("cookie_no_guardada");
}

export function borrarCookie(clave) {
  document.cookie = `${nombre(clave)}=; Path=/; Max-Age=0; SameSite=Lax`;
}
