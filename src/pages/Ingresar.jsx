import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";

import Marca from "../components/Marca/Marca.jsx";
import Campo from "../components/Campo/Campo.jsx";
import CampoClave from "../components/CampoClave/CampoClave.jsx";
import Boton from "../components/Boton/Boton.jsx";
import Aviso from "../components/Aviso/Aviso.jsx";
import Icono from "../components/Icono/Icono.jsx";
import SaltarContenido from "../components/SaltarContenido/SaltarContenido.jsx";
import GestorCookies from "../components/GestorCookies/GestorCookies.jsx";
import { usePreferencias } from "../hooks/usePreferencias.js";
import { useSesion } from "../hooks/useSesion.js";
import { interpolar } from "../utils/formato.js";
import "./Ingresar.css";

/**
 * Vista 4 · Iniciar sesión (US-TAQ-S2-03 y US-TAQ-S2-04) con POST /sesion.
 * Estados de Figma: campos obligatorios, cargando, credenciales incorrectas,
 * demasiados intentos (429 + Retry-After) y error de conexión.
 */
export default function Ingresar() {
  const { textos } = usePreferencias();
  const { usuario, iniciarSesion } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();

  const t = textos?.paginas?.ingresar;
  const formulario = t?.formulario;
  const errores = t?.errores;

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mantener, setMantener] = useState(true);
  const [erroresCampo, setErroresCampo] = useState({});
  const [aviso, setAviso] = useState(
    location.state?.sesionVencida ? "sesionVencida" : null,
  );
  const [enviando, setEnviando] = useState(false);
  const [segundosBloqueo, setSegundosBloqueo] = useState(0);

  const refCorreo = useRef(null);
  const refClave = useRef(null);

  // Cuenta regresiva del bloqueo por demasiados intentos.
  useEffect(() => {
    if (segundosBloqueo <= 0) return undefined;
    const temporizador = setTimeout(
      () => setSegundosBloqueo((valor) => valor - 1),
      1000,
    );
    return () => clearTimeout(temporizador);
  }, [segundosBloqueo]);

  const bloqueado = segundosBloqueo > 0;

  if (usuario && !enviando) {
    return <Navigate to="/" replace />;
  }

  function validar() {
    const nuevos = {};
    if (!correo.trim()) nuevos.correo = errores?.correoObligatorio;
    if (!clave) nuevos.clave = errores?.claveObligatoria;
    return nuevos;
  }

  async function enviar(evento) {
    evento?.preventDefault();
    if (enviando || bloqueado) return;

    const nuevos = validar();
    setErroresCampo(nuevos);

    if (Object.keys(nuevos).length) {
      setAviso("camposObligatorios");
      // El foco va al primer campo con error.
      (nuevos.correo ? refCorreo : refClave).current?.focus();
      return;
    }

    setAviso(null);
    setEnviando(true);

    try {
      await iniciarSesion(correo.trim(), clave);
      navigate("/", { replace: true });
    } catch (error) {
      if (error.codigo === "credenciales_invalidas") {
        setAviso("credenciales");
      } else if (error.codigo === "demasiadas_peticiones") {
        setSegundosBloqueo(error.reintentarEn || 0);
        setAviso("demasiadosIntentos");
      } else if (error.codigo === "validacion" && error.campos) {
        setErroresCampo({
          correo: error.campos.correo && errores?.correoObligatorio,
          clave: error.campos.clave && errores?.claveObligatoria,
        });
        setAviso("camposObligatorios");
      } else {
        // Sin código: no hubo respuesta de la API (sin red o caída).
        setAviso("conexion");
      }
    } finally {
      setEnviando(false);
    }
  }

  function textoAviso() {
    if (aviso === "sesionVencida") {
      return {
        tipo: "informacion",
        titulo: textos?.estados?.sesionVencida?.titulo,
        texto: textos?.estados?.sesionVencida?.texto,
      };
    }
    if (aviso === "demasiadosIntentos") {
      return {
        titulo: errores?.demasiadosIntentos?.titulo,
        texto: interpolar(errores?.demasiadosIntentos?.texto, {
          segundos: segundosBloqueo,
        }),
      };
    }
    return aviso ? errores?.[aviso] : null;
  }

  const mensaje = textoAviso();

  return (
    <div className="pagina-ingresar">
      <title>{t?.seo?.titulo}</title>
      <meta name="description" content={t?.seo?.descripcion} />
      <SaltarContenido texto={textos?.general?.aria?.saltarAlContenido} />

      <aside className="portada-ingresar">
        <Marca
          nombre={textos?.navbar?.logo?.texto}
          etiqueta={textos?.navbar?.logo?.aria}
          inverso
        />
        <div className="presentacion-ingresar">
          <p className="lema-ingresar">{t?.presentacion?.lema}</p>
          <ul>
            {Object.entries(t?.presentacion?.beneficios ?? {}).map(
              ([clave, texto]) => (
                <li key={clave}>
                  <span className="check-ingresar">
                    <Icono nombre="check" tamano={14} />
                  </span>
                  {texto}
                </li>
              ),
            )}
          </ul>
        </div>
      </aside>

      <main id="contenido" tabIndex={-1} className="contenido-ingresar">
        <form className="formulario-ingresar" onSubmit={enviar} noValidate>
          <h1>{formulario?.titulo}</h1>
          <p className="subtitulo-ingresar">{formulario?.subtitulo}</p>

          {mensaje && (
            <Aviso
              tipo={mensaje.tipo ?? "error"}
              titulo={mensaje.titulo}
              texto={mensaje.texto}
            />
          )}

          <Campo
            ref={refCorreo}
            etiqueta={formulario?.etiquetas?.correo}
            type="email"
            name="correo"
            autoComplete="email"
            inputMode="email"
            placeholder={formulario?.placeholders?.correo}
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            error={erroresCampo.correo}
            disabled={bloqueado}
          />

          <CampoClave
            ref={refClave}
            etiqueta={formulario?.etiquetas?.clave}
            name="clave"
            autoComplete="current-password"
            value={clave}
            onChange={(evento) => setClave(evento.target.value)}
            error={erroresCampo.clave}
            disabled={bloqueado}
            textoMostrar={formulario?.botones?.mostrarClave}
            textoOcultar={formulario?.botones?.ocultarClave}
          />

          <div className="fila-ingresar">
            <label className="casilla">
              <input
                type="checkbox"
                checked={mantener}
                onChange={(evento) => setMantener(evento.target.checked)}
              />
              <span className="casilla-caja" aria-hidden="true">
                <Icono nombre="check" tamano={14} />
              </span>
              {formulario?.etiquetas?.mantenerSesion}
            </label>
            {/* En el Figma móvil este enlace no aparece */}
            <Link
              className="enlace-subrayado enlace-olvidaste"
              to="/recuperar-clave"
            >
              {formulario?.enlaces?.olvidasteClave}
            </Link>
          </div>

          <Boton
            type="submit"
            tamano="g"
            className="boton-ingresar"
            disabled={enviando || bloqueado}
            aria-busy={enviando || undefined}
          >
            {enviando && <span className="giro" aria-hidden="true" />}
            {/* Figma «error de conexión»: el botón principal pasa a «Reintentar» */}
            {enviando
              ? formulario?.mensajes?.ingresando
              : aviso === "conexion"
                ? errores?.conexion?.botones?.reintentar
                : formulario?.botones?.ingresar}
          </Boton>

          <p className="registro-ingresar">
            {formulario?.mensajes?.sinCuenta}{" "}
            <Link className="enlace-subrayado" to="/registro">
              {formulario?.enlaces?.crearCuenta}
            </Link>
          </p>
        </form>
      </main>

      <GestorCookies />
    </div>
  );
}