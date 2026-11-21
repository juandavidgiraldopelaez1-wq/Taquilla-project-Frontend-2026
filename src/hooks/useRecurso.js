import { useEffect, useState } from "react";
import { consultar } from "../services/api.js";

/**
 * Consulta un recurso GET de la API y expone { datos, error, cargando,
 * recargar }. Cancela la petición si la ruta cambia o el componente se
 * desmonta. Con `ruta` null no consulta nada.
 * Mientras llega una respuesta nueva conserva los datos anteriores, así un
 * cambio de idioma no deja la interfaz en blanco.
 */
export function useRecurso(ruta, { cache = false } = {}) {
  const [estado, setEstado] = useState({
    clave: null,
    datos: null,
    error: null,
  });
  const [intento, setIntento] = useState(0);

  // Cada combinación de ruta + intento es una consulta distinta.
  const clave = `${ruta}#${intento}`;

  useEffect(() => {
    if (!ruta) return;

    const controlador = new AbortController();
    let vigente = true;

    consultar(ruta, { signal: controlador.signal, cache })
      .then((datos) => {
        if (vigente) setEstado({ clave, datos, error: null });
      })
      .catch((error) => {
        if (vigente && error.name !== "AbortError") {
          setEstado({ clave, datos: null, error });
        }
      });

    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [ruta, clave, cache]);

  const listo = estado.clave === clave;

  return {
    datos: estado.datos,
    error: listo ? estado.error : null,
    cargando: Boolean(ruta) && !listo,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
