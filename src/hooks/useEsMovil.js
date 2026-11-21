import { useSyncExternalStore } from "react";

// Mismo punto de quiebre móvil que usan los estilos.
const CONSULTA_MOVIL = "(max-width: 640px)";

function suscribir(avisar) {
  const media = window.matchMedia(CONSULTA_MOVIL);
  media.addEventListener("change", avisar);
  return () => media.removeEventListener("change", avisar);
}

/** true cuando la pantalla es de celular (390 px en Figma). */
export function useEsMovil() {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA_MOVIL).matches,
  );
}
