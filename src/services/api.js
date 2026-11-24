import { proyecto } from "../config/proyecto.js";

/*
 * Cliente único de la API. Todas las peticiones pasan por aquí: arma la URL
 * con VITE_API_URL, envía la cookie «sesion» (credentials: "include") y
 * convierte las respuestas de error en un Error con el `codigo` de la API.
 */

/*
 * Cabeceras para probar estados de carga y error (US-TAQ-S2-02) sin tocar
 * el código. Se activan desde el .env (VITE_SIMULAR_LATENCIA y
 * VITE_SIMULAR_ERROR) o, para probar en el despliegue, desde la dirección:
 * ?simularLatencia=2000 o ?simularError=503. Lo de la dirección se recuerda
 * en esta pestaña; ?simularError= (vacío) lo quita.
 *
 * No se aplican a /textos ni a /idiomas: si fallaran, el estado de error
 * no tendría sus mensajes, que salen de textos.estados y textos.errores.
 */
const RUTAS_SIN_SIMULACION = ["/textos", "/idiomas"];

function valorSimulacion(nombre, valorEnv) {
  try {
    const parametros = new URLSearchParams(window.location.search);
    const clave = `taquilla:${nombre}`;

    if (parametros.has(nombre)) {
      const valor = parametros.get(nombre);
      if (valor) sessionStorage.setItem(clave, valor);
      else sessionStorage.removeItem(clave);
    }

    return sessionStorage.getItem(clave) || valorEnv;
  } catch {
    return valorEnv;
  }
}

function cabecerasSimulacion(ruta) {
  if (RUTAS_SIN_SIMULACION.some((inicio) => ruta.startsWith(inicio))) {
    return {};
  }

  const latencia = valorSimulacion("simularLatencia", proyecto.simularLatencia);
  const error = valorSimulacion("simularError", proyecto.simularError);

  return {
    ...(latencia && { "X-Simular-Latencia": latencia }),
    ...(error && { "X-Simular-Error": error }),
  };
}

// Respuestas GET guardadas en memoria para datos que casi no cambian
// (idiomas, textos, categorías, ciudades) y así no repetir peticiones.
const memoria = new Map();

/** Error de la API con el formato { error: { codigo, mensaje, campos } }. */
export class ErrorApi extends Error {
  constructor({ estado, codigo, mensaje, campos, detalles, reintentarEn }) {
    super(mensaje || codigo || `HTTP ${estado}`);
    this.name = "ErrorApi";
    this.estado = estado;
    this.codigo = codigo;
    this.campos = campos;
    this.detalles = detalles;
    this.reintentarEn = reintentarEn;
  }
}

async function leerCuerpo(respuesta) {
  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  try {
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

/**
 * Hace una petición a la API.
 * - ruta: por ejemplo "/eventos?pagina=2"
 * - metodo y cuerpo: para POST/DELETE (el cuerpo se envía como JSON)
 * - cache: guarda la respuesta GET en memoria durante la sesión
 */
export async function consultar(
  ruta,
  { metodo = "GET", cuerpo, signal, cache = false } = {},
) {
  const url = `${proyecto.api}${ruta}`;

  if (cache && metodo === "GET" && memoria.has(url)) {
    return memoria.get(url);
  }

  const respuesta = await fetch(url, {
    method: metodo,
    signal,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(cuerpo !== undefined && { "Content-Type": "application/json" }),
      ...cabecerasSimulacion(ruta),
    },
    body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
  });

  const datos = await leerCuerpo(respuesta);

  if (!respuesta.ok) {
    const error = datos?.error ?? {};
    throw new ErrorApi({
      estado: respuesta.status,
      codigo: error.codigo,
      mensaje: error.mensaje,
      campos: error.campos,
      detalles: error.detalles,
      reintentarEn:
        Number(respuesta.headers.get("Retry-After")) ||
        error.detalles?.reintentarEnSegundos,
    });
  }

  if (cache && metodo === "GET") memoria.set(url, datos);

  return datos;
}