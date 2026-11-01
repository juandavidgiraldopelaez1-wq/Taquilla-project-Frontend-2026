import { useState } from "react";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import { interfaz } from "../../data/interfaz.js";
import BannerCookies from "../BannerCookies/BannerCookies.jsx";
import PreferenciasCookies from "../PreferenciasCookies/PreferenciasCookies.jsx";
import "./GestorCookies.css";
export default function GestorCookies({ abierto, onAbrir, onCerrar }) {
  const { idioma, consentimiento, guardarConsentimiento, error } =
    usePreferencias();
  const [mensaje, setMensaje] = useState(false);
  const t = interfaz[idioma];
  function guardar(permitir) {
    if (guardarConsentimiento(permitir)) {
      setMensaje(true);
      onCerrar();
    }
  }
  return (
    <>
      {!consentimiento && (
        <BannerCookies
          textos={t}
          onAceptar={() => guardar(true)}
          onRechazar={() => guardar(false)}
          onConfigurar={onAbrir}
        />
      )}
      {error && !abierto && (
        <p className="error-cookies" role="alert">
          {t.error}
        </p>
      )}
      <PreferenciasCookies
        abierto={abierto}
        textos={t}
        permitir={consentimiento === "aceptado"}
        onGuardar={guardar}
        onCerrar={onCerrar}
        error={error}
      />
      <span className="solo-lectores" role="status">
        {mensaje ? t.guardado : ""}
      </span>
    </>
  );
}
