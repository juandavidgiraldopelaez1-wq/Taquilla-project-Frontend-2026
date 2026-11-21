import { usePreferencias } from "../../hooks/usePreferencias.js";
import BannerCookies from "../BannerCookies/BannerCookies.jsx";
import "./GestorCookies.css";

/**
 * Aviso de cookies de la primera visita (US-TAQ-S1-06): solo Aceptar y
 * Rechazar, sin panel de preferencias. La decisión se guarda en la cookie
 * «consentimiento» y el aviso no vuelve a salir.
 */
export default function GestorCookies() {
  const { consentimiento, guardarConsentimiento, error, textos } =
    usePreferencias();

  return (
    <>
      {!consentimiento && (
        <BannerCookies
          textos={textos?.cookies?.banner}
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
