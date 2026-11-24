import { usePreferencias } from "../../hooks/usePreferencias.js";
import BannerCookies from "../BannerCookies/BannerCookies.jsx";
import "./GestorCookies.css";

/**
 * Aviso de cookies de la primera visita (US-TAQ-S1-06): solo Aceptar y
 * Rechazar, sin panel de preferencias. La decisión se guarda en la cookie
 * «consentimiento». El enlace «Configurar cookies» del pie lo vuelve a
 * mostrar para cambiar la decisión (US-TAQ-S1-10).
 */
export default function GestorCookies() {
  const {
    consentimiento,
    guardarConsentimiento,
    avisoCookiesAbierto,
    error,
    textos,
  } = usePreferencias();

  return (
    <>
      {(!consentimiento || avisoCookiesAbierto) && (
        <BannerCookies
          textos={textos?.cookies?.banner}
          enfocar={avisoCookiesAbierto}
          onAceptar={() => guardarConsentimiento(true)}
          onRechazar={() => guardarConsentimiento(false)}
        />
      )}
      {error && (
        <p className="error-cookies" role="alert">
          {textos?.errores?.generico}
        </p>
      )}
    </>
  );
}
