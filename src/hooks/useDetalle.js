import { useState } from "react";
export function useDetalle(idioma = "es") {
  const [detalle, setDetalle] = useState(null);
  function abrirCuenta(tipo) {
    const en = idioma === "en";
    setDetalle({
      titulo:
        tipo === "registro"
          ? en
            ? "Create an account"
            : "Crear cuenta"
          : en
            ? "Log in"
            : "Iniciar sesión",
      descripcion: en
        ? "Account access is not available yet. You can explore the public catalogue without signing in."
        : "El acceso a cuentas aún no está disponible. Puedes explorar el catálogo público sin iniciar sesión.",
      cerrar: en ? "Continue exploring" : "Seguir explorando",
    });
  }
  return { detalle, setDetalle, abrirCuenta };
}
