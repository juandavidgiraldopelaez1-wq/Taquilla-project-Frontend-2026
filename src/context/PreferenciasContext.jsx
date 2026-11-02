
import { createContext, useContext, useEffect, useState } from "react";
import {
  leerCookie,
  guardarCookie,
  borrarCookie,
} from "../services/cookies.js";
import { proyecto } from "../config/proyecto.js";

const PreferenciasContext = createContext(null);

const CLAVE_ACCESIBILIDAD = "preferenciasAccesibilidad";

const ACCESIBILIDAD_INICIAL = {
  tamanoTexto: 100,
  altoContraste: false,
  reducirMovimiento: false,
  subrayarEnlaces: false,
  espaciadoLectura: false,
};

const OPCIONES_ACCESIBILIDAD = [
  "altoContraste",
  "reducirMovimiento",
  "subrayarEnlaces",
  "espaciadoLectura",
];

function leerPreferenciasAccesibilidad() {
  try {
    const guardadas = JSON.parse(
      localStorage.getItem(CLAVE_ACCESIBILIDAD),
    );

    if (!guardadas || typeof guardadas !== "object" || Array.isArray(guardadas)) {
      return { ...ACCESIBILIDAD_INICIAL };
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
    return { ...ACCESIBILIDAD_INICIAL };
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

  useEffect(() => {
    document.documentElement.lang = idioma;
    document.title = `${proyecto.nombre} · ${idioma === "en" ? "Home" : "Inicio"}`;
  }, [idioma]);

  // Guarda las preferencias de accesibilidad en este dispositivo.
  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_ACCESIBILIDAD,
        JSON.stringify(accesibilidad),
      );
      setErrorAccesibilidad(false);
    } catch {
      setErrorAccesibilidad(true);
    }
  }, [accesibilidad]);

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
      if (consentimiento === "aceptado") guardarCookie("idioma", valor);
      setError(false);
    } catch {
      setError(true);
    }
  }

  function guardarConsentimiento(permitir) {
    try {
      const valor = permitir ? "aceptado" : "rechazado";
      guardarCookie("consentimiento", valor);
      if (permitir) guardarCookie("idioma", idioma);
      else borrarCookie("idioma");
      setConsentimiento(valor);
      setError(false);
      return true;
    } catch {
      setError(true);
      return false;
    }
  }

  function ajustarTamanoTexto(direccion) {
    if (direccion === 0) return;

    setAccesibilidad((actual) => ({
      ...actual,
      tamanoTexto: Math.min(
        150,
        Math.max(80, actual.tamanoTexto + Math.sign(direccion) * 10),
      ),
    }));
  }

  function cambiarOpcionAccesibilidad(opcion, valor) {
    if (!OPCIONES_ACCESIBILIDAD.includes(opcion)) return;

    setAccesibilidad((actual) => ({
      ...actual,
      [opcion]: Boolean(valor),
    }));
  }

  function restablecerAccesibilidad() {
    setAccesibilidad({ ...ACCESIBILIDAD_INICIAL });
  }

  return (
    <PreferenciasContext.Provider
      value={{
        idioma,
        cambiarIdioma,
        consentimiento,
        guardarConsentimiento,
        error,
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

export function usePreferencias() {
  const valor = useContext(PreferenciasContext);
  if (!valor) throw new Error("PreferenciasProvider requerido");
  return valor;
}
