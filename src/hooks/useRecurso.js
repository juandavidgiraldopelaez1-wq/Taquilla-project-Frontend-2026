import { useEffect, useState } from "react";
import { consultar } from "../services/api.js";

export function useRecurso(ruta) {
  const [estado, setEstado] = useState({
    clave: null,
    datos: null,
    error: null,
    cargando: true,
  });
  const [intento, setIntento] = useState(0);
  // Cada combinación de ruta + intento es una consulta distinta.
  const clave = `${ruta}#${intento}`;
  useEffect(() => {
    if (!ruta) return;
    const controlador = new AbortController();
    let vigente = true;
    consultar(ruta, { signal: controlador.signal })
      .then((datos) => {
        if (vigente) setEstado({ clave, datos, error: null, cargando: false });
      })
      .catch((error) => {
        if (vigente && error.name !== "AbortError")
          setEstado({ clave, datos: null, error, cargando: false });
      });
    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [ruta, clave]);
  // Mientras llega la respuesta de la consulta actual, se muestra "cargando".
  const actual =
    estado.clave === clave
      ? estado
      : { datos: null, error: null, cargando: Boolean(ruta) };
  return { ...actual, recargar: () => setIntento((valor) => valor + 1) };
}
