import { createContext, useContext, useEffect, useState } from "react";
import {
  leerCookie,
  guardarCookie,
  borrarCookie,
} from "../services/cookies.js";
import { proyecto } from "../config/proyecto.js";

const PreferenciasContext = createContext(null);

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
  useEffect(() => {
    document.documentElement.lang = idioma;
    document.title = `${proyecto.nombre} · ${idioma === "en" ? "Home" : "Inicio"}`;
  }, [idioma]);
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
  return (
    <PreferenciasContext.Provider
      value={{
        idioma,
        cambiarIdioma,
        consentimiento,
        guardarConsentimiento,
        error,
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
