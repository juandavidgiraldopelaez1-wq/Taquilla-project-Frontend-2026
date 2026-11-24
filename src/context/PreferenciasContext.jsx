import { useEffect, useState } from "react";
import {
  leerCookie,
  guardarCookie,
  borrarCookie,
} from "../services/cookies.js";
import { useRecurso } from "../hooks/useRecurso.js";
import { PreferenciasContext } from "./preferenciasContexto.js";

const CLAVE_ACCESIBILIDAD = "preferenciasAccesibilidad";

// «Los valores iniciales salen de lo que ya definiste en tu sistema»:
// alto contraste y reducir movimiento parten de la configuración del equipo.
function prefiereSistema(consulta) {
  return typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia(consulta).matches
    : false;
}

function accesibilidadInicial() {
  return {
    tamanoTexto: 100,
    altoContraste: prefiereSistema("(prefers-contrast: more)"),
    reducirMovimiento: prefiereSistema("(prefers-reduced-motion: reduce)"),
    subrayarEnlaces: false,
    espaciadoLectura: false,
  };
}

const OPCIONES_ACCESIBILIDAD = [
  "altoContraste",
  "reducirMovimiento",
  "subrayarEnlaces",
  "espaciadoLectura",
];

function leerPreferenciasAccesibilidad() {
  try {
    const guardadas = JSON.parse(localStorage.getItem(CLAVE_ACCESIBILIDAD));

    if (
      !guardadas ||
      typeof guardadas !== "object" ||
      Array.isArray(guardadas)
    ) {
      return accesibilidadInicial();
    }

    return {
      tamanoTexto: Number.isFinite(guardadas.tamanoTexto)
        ? Math.min(150, Math.max(80, guardadas.tamanoTexto))
        : 100,
      altoContraste: guardadas.altoContraste === true,
      reducirMovimiento: guardadas.reducirMovimiento === true,
      subrayarEnlaces: guardadas.subrayarEnlaces === true,
      espaciadoLectura: guardadas.espaciadoLectura === true,
    };
  } catch {
    return accesibilidadInicial();
  }
}

export function PreferenciasProvider({ children }) {
  const [consentimiento, setConsentimiento] = useState(() => {
    const valor = leerCookie("consentimiento");
    return ["aceptado", "rechazado"].includes(valor) ? valor : null;
  });

  const [idioma, setIdioma] = useState(() =>
    leerCookie("consentimiento") === "aceptado" && leerCookie("idioma") === "en"
      ? "en"
      : "es",
  );

  const [error, setError] = useState(false);

  const [accesibilidad, setAccesibilidad] = useState(
    leerPreferenciasAccesibilidad,
  );

  const [errorAccesibilidad, setErrorAccesibilidad] = useState(false);

  // Textos de los estados (cargando, error…). Se piden aparte con
  // ?seccion=estados porque es una respuesta pequeña que llega primero:
  // así la pantalla de carga ya tiene sus mensajes de la API mientras
  // llegan los demás textos (indicación de la profesora: nada escrito
  // a mano, ni siquiera el «Cargando…»).
  const { datos: respuestaEstados } = useRecurso(
    `/textos?idioma=${idioma}&seccion=estados`,
    { cache: true },
  );

  // Todos los textos de la interfaz en el idioma actual.
  const {
    datos: respuestaTextos,
    error: errorTextos,
    recargar: recargarTextos,
  } = useRecurso(`/textos?idioma=${idioma}`, { cache: true });

  // Mientras llegan todos los textos se usan los de los estados.
  const textosEstados = respuestaEstados?.textos?.estados;
  const textos =
    respuestaTextos?.textos ??
    (textosEstados ? { estados: textosEstados } : null);
  const textosListos = Boolean(respuestaTextos?.textos);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  // Expone los ajustes para que los estilos puedan aplicarlos a la página.
  useEffect(() => {
    const raiz = document.documentElement;

    raiz.dataset.altoContraste = String(accesibilidad.altoContraste);
    raiz.dataset.reducirMovimiento = String(accesibilidad.reducirMovimiento);
    raiz.dataset.subrayarEnlaces = String(accesibilidad.subrayarEnlaces);
    raiz.dataset.espaciadoLectura = String(accesibilidad.espaciadoLectura);

    raiz.style.setProperty(
      "--escala-texto",
      String(accesibilidad.tamanoTexto / 100),
    );
  }, [accesibilidad]);

  function cambiarIdioma(valor) {
    setIdioma(valor);

    try {
      if (consentimiento === "aceptado") {
        guardarCookie("idioma", valor);
      }

      setError(false);
    } catch {
      setError(true);
    }
  }

  function guardarConsentimiento(permitir) {
    try {
      const valor = permitir ? "aceptado" : "rechazado";

      guardarCookie("consentimiento", valor);

      if (permitir) {
        guardarCookie("idioma", idioma);
      } else {
        borrarCookie("idioma");
      }

      setConsentimiento(valor);
      setError(false);

      return true;
    } catch {
      setError(true);
      return false;
    }
  }

  // Actualiza las preferencias y las guarda en este dispositivo.
  function actualizarAccesibilidad(siguiente) {
    setAccesibilidad(siguiente);

    try {
      localStorage.setItem(CLAVE_ACCESIBILIDAD, JSON.stringify(siguiente));
      setErrorAccesibilidad(false);
    } catch {
      setErrorAccesibilidad(true);
    }
  }

  function ajustarTamanoTexto(direccion) {
    if (direccion === 0) return;

    actualizarAccesibilidad({
      ...accesibilidad,
      tamanoTexto: Math.min(
        150,
        Math.max(80, accesibilidad.tamanoTexto + Math.sign(direccion) * 10),
      ),
    });
  }

  function cambiarOpcionAccesibilidad(opcion, valor) {
    if (!OPCIONES_ACCESIBILIDAD.includes(opcion)) return;

    actualizarAccesibilidad({
      ...accesibilidad,
      [opcion]: Boolean(valor),
    });
  }

  function restablecerAccesibilidad() {
    actualizarAccesibilidad(accesibilidadInicial());
  }

  return (
    <PreferenciasContext.Provider
      value={{
        idioma,
        cambiarIdioma,
        consentimiento,
        guardarConsentimiento,
        error,
        textos,
        textosListos,
        errorTextos,
        recargarTextos,
        accesibilidad,
        ajustarTamanoTexto,
        cambiarOpcionAccesibilidad,
        restablecerAccesibilidad,
        errorAccesibilidad,
      }}
    >
      {children}
    </PreferenciasContext.Provider>
  );
}
