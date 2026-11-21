import { fechaISO } from "./formato.js";

/** Arma la ruta de Explorar con los filtros en la URL (sin valores vacíos). */
export function rutaExplorar(filtros = {}) {
  const parametros = new URLSearchParams();
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") {
      parametros.set(clave, String(valor));
    }
  });
  const consulta = parametros.toString();
  return consulta ? `/explorar?${consulta}` : "/explorar";
}

/**
 * Rango de fechas de los atajos de Figma (Hoy, Este fin de semana, Este mes).
 * Devuelve { desde, hasta } en formato AAAA-MM-DD para GET /eventos.
 */
export function rangoFecha(atajo, hoy = new Date()) {
  if (atajo === "hoy") {
    const dia = fechaISO(hoy);
    return { desde: dia, hasta: dia };
  }

  if (atajo === "finDeSemana") {
    const sabado = new Date(hoy);
    sabado.setDate(hoy.getDate() + ((6 - hoy.getDay() + 7) % 7));
    const domingo = new Date(sabado);
    domingo.setDate(sabado.getDate() + 1);
    return { desde: fechaISO(sabado), hasta: fechaISO(domingo) };
  }

  if (atajo === "mes") {
    const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimo = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    return { desde: fechaISO(primero), hasta: fechaISO(ultimo) };
  }

  return { desde: "", hasta: "" };
}

/** Atajo de fecha que corresponde a un rango, o "" si es personalizado. */
export function atajoDeRango(desde, hasta, hoy = new Date()) {
  if (!desde && !hasta) return "";
  return (
    ["hoy", "finDeSemana", "mes"].find((atajo) => {
      const rango = rangoFecha(atajo, hoy);
      return rango.desde === desde && rango.hasta === hasta;
    }) ?? "personalizada"
  );
}
