import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { consultar } from "../services/api.js";
import { SesionContext } from "./sesionContexto.js";

/**
 * Sesión con la cookie httpOnly «sesion» que pone la API (US-TAQ-S2-05).
 * El token nunca se guarda en el navegador: todas las peticiones envían la
 * cookie (credentials: "include") y GET /sesion dice quién ingresó.
 */
export function SesionProvider({ children }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(true);

  // Pregunta a la API quién tiene la sesión. Si había una persona y la API
  // responde 401 no_autenticado, la sesión venció: se la lleva a ingresar.
  const verificar = useCallback(
    async (habiaSesion = false) => {
      try {
        const respuesta = await consultar("/sesion");
        setUsuario(respuesta?.usuario ?? null);
      } catch (error) {
        setUsuario(null);
        if (habiaSesion && error.codigo === "no_autenticado") {
          navigate("/ingresar", { state: { sesionVencida: true } });
        }
      } finally {
        setVerificando(false);
      }
    },
    [navigate],
  );

  // Al cargar el sitio: ¿hay una sesión guardada en la cookie?
  useEffect(() => {
    let vigente = true;
    consultar("/sesion")
      .then((respuesta) => vigente && setUsuario(respuesta?.usuario ?? null))
      .catch(() => vigente && setUsuario(null))
      .finally(() => vigente && setVerificando(false));
    return () => {
      vigente = false;
    };
  }, []);

  // Al volver a la pestaña se revisa si la sesión sigue vigente.
  useEffect(() => {
    if (!usuario) return undefined;

    function alVolver() {
      if (document.visibilityState === "visible") verificar(true);
    }

    document.addEventListener("visibilitychange", alVolver);
    return () => document.removeEventListener("visibilitychange", alVolver);
  }, [usuario, verificar]);

  async function iniciarSesion(correo, clave) {
    const respuesta = await consultar("/sesion", {
      metodo: "POST",
      cuerpo: { correo, clave },
    });
    setUsuario(respuesta?.usuario ?? null);
    return respuesta?.usuario;
  }

  async function cerrarSesion() {
    try {
      await consultar("/sesion", { metodo: "DELETE" });
    } finally {
      setUsuario(null);
      navigate("/");
    }
  }

  return (
    <SesionContext.Provider
      value={{ usuario, verificando, iniciarSesion, cerrarSesion }}
    >
      {children}
    </SesionContext.Provider>
  );
}
