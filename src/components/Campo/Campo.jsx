import { useId } from "react";
import "./Campo.css";

/**
 * Campo de formulario con etiqueta visible (Figma: «Campo»).
 * Estados: normal, foco (CSS :focus-visible) y error (prop `error`).
 * El mensaje de error queda asociado al campo con aria-describedby.
 */
export default function Campo({
  etiqueta,
  error,
  id,
  className = "",
  sufijo,
  ref,
  ...props
}) {
  const idGenerado = useId();
  const idCampo = id ?? idGenerado;
  const idError = `${idCampo}-error`;

  return (
    <div className={`campo ${error ? "campo--error" : ""} ${className}`.trim()}>
      <label className="campo-etiqueta" htmlFor={idCampo}>
        {etiqueta}
      </label>

      <div className="campo-caja">
        <input
          ref={ref}
          id={idCampo}
          className="campo-control"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? idError : undefined}
          {...props}
        />
        {sufijo}
      </div>

      {error && (
        <p className="campo-mensaje" id={idError}>
          {error}
        </p>
      )}
    </div>
  );
}
