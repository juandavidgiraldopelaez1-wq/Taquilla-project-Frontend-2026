import { proyecto } from "../config/proyecto.js";

export async function consultar(ruta, { signal } = {}) {
  const respuesta = await fetch(`${proyecto.api}${ruta}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    const error = new Error(datos.error?.mensaje || `HTTP ${respuesta.status}`);
    error.codigo = datos.error?.codigo;
    error.campos = datos.error?.campos;
    throw error;
  }
  return datos;
}
