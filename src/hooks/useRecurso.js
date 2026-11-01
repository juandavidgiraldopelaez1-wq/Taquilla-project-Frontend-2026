import { useEffect, useState } from "react";
import { consultar } from "../services/api.js";

export function useRecurso(ruta) {
  const [estado, setEstado] = useState({
    ruta: null,
    datos: null,
    error: null,
    cargando: true,
  });
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    if (!ruta) return;
    const controlador = new AbortController();
    let vigente = true;
    setEstado({ ruta, datos: null, error: null, cargando: true });
    consultar(ruta, { signal: controlador.signal })
      .then((datos) => {
        if (vigente) setEstado({ ruta, datos, error: null, cargando: false });
      })
      .catch((error) => {
        if (vigente && error.name !== "AbortError")
          setEstado({ ruta, datos: null, error, cargando: false });
      });
    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [ruta, intento]);
  const actual =
    estado.ruta === ruta
      ? estado
      : { datos: null, error: null, cargando: Boolean(ruta) };
  return { ...actual, recargar: () => setIntento((valor) => valor + 1) };
}
