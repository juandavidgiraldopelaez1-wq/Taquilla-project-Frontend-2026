
import { useState } from "react";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import { interfaz } from "../../data/interfaz.js";
import BannerCookies from "../BannerCookies/BannerCookies.jsx";
import PreferenciasCookies from "../PreferenciasCookies/PreferenciasCookies.jsx";
import "./GestorCookies.css";

export default function GestorCookies({ abierto, onAbrir, onCerrar }) {
  const {
    idioma,
    consentimiento,
    guardarConsentimiento,
    error,
    textos: textosApi,
  } = usePreferencias();

  const [mensaje, setMensaje] = useState(false);

  const base = interfaz[idioma] || interfaz.es;

  const apiCookies = textosApi?.cookies;
  const apiBanner = apiCookies?.banner;
  const apiPreferencias = apiCookies?.preferencias;

  const necesarias = apiPreferencias?.categorias?.necesarias;
  const preferencias = apiPreferencias?.categorias?.preferencias;

  const t = {
    ...base,

    // Banner de consentimiento.
    banner: apiBanner?.titulo ?? base.banner,
    descripcion: apiBanner?.texto ?? base.descripcion,
    aceptar: apiBanner?.botones?.aceptar ?? base.aceptar,
    rechazar: apiBanner?.botones?.rechazar ?? base.rechazar,

    // Panel de preferencias.
    cookies: apiPreferencias?.titulo ?? base.cookies,
    descripcionPreferencias:
      apiPreferencias?.texto ?? base.descripcion,

    necesarias: necesarias?.nombre ?? base.necesarias,
    necesariasTexto:
      necesarias?.descripcion ?? base.necesariasTexto,

    preferencias: preferencias?.nombre ?? base.preferencias,
    preferenciasTexto:
      preferencias?.descripcion ?? base.preferenciasTexto,

    guardar:
      apiPreferencias?.botones?.guardarSeleccion ?? base.guardar,

    cerrar:
      textosApi?.general?.acciones?.cerrar ?? base.cerrar,

    guardado:
      apiPreferencias?.mensajes?.guardada ?? base.guardado,
  };

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
