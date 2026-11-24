import { useCallback, useSyncExternalStore } from "react";

// Mismo punto de quiebre móvil que usan los estilos.
const CONSULTA_MOVIL = "(max-width: 640px)";

/**
 * true cuando la pantalla cumple la consulta de medios.
 * Por defecto: pantalla de celular (390 px en Figma).
 */
export function useEsMovil(consulta = CONSULTA_MOVIL) {
  const suscribir = useCallback(
    (avisar) => {
      const media = window.matchMedia(consulta);
      media.addEventListener("change", avisar);
      return () => media.removeEventListener("change", avisar);
    },
    [consulta],
  );

  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(consulta).matches,
  );
}
