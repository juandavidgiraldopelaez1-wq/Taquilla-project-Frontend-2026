import { useState } from "react";
import IconoEvento from "../IconoEvento/IconoEvento.jsx";
import Boton from "../Boton/Boton.jsx";
import Icono from "../Icono/Icono.jsx";
import { interpolar } from "../../utils/formato.js";
import { rangoFecha } from "../../utils/filtros.js";
import { useEsMovil } from "../../hooks/useEsMovil.js";
import "./BuscadorEventos.css";

// Atajos de fecha del diseño; sus nombres salen de paginas.explorar.filtros.fecha.
const ATAJOS_FECHA = ["hoy", "finDeSemana", "mes"];

/**
 * Buscador principal del hero (Figma: «Buscador principal»).
 * Qué, Dónde (GET /ciudades) y Cuándo. Al buscar, lleva a Explorar con los
 * filtros en la URL. La ciudad elegida también cambia «Próximamente en…».
 */
export default function BuscadorEventos({
  textos,
  ciudades,
  ciudad,
  onCambiarCiudad,
  onBuscar,
}) {
  const [consulta, setConsulta] = useState("");
  const [atajo, setAtajo] = useState("");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const esMovil = useEsMovil();

  const buscador = textos?.paginas?.inicio?.hero?.buscador;
  const fechas = textos?.paginas?.explorar?.filtros?.fecha;
  const etiquetaFecha = atajo
    ? fechas?.[atajo]
    : buscador?.placeholders?.cuando;

  function buscar(evento) {
    evento.preventDefault();
    setFiltrosAbiertos(false);
    onBuscar({ q: consulta.trim(), ciudad, ...rangoFecha(atajo) });
  }

  return (
    <form
      className={`buscador-eventos ${filtrosAbiertos ? "filtros-moviles-abiertos" : ""}`}
      role="search"
      aria-label={textos?.navbar?.buscador?.aria}
      onSubmit={buscar}
    >
      <label className="campo-consulta">
        <IconoEvento tipo="buscar" tamano={18} />
        <span>
          <span>{buscador?.etiquetas?.que}</span>
          <input
            type="search"
            value={consulta}
            onChange={(evento) => setConsulta(evento.target.value)}
            placeholder={
              esMovil
                ? buscador?.placeholders?.movil
                : buscador?.placeholders?.que
            }
          />
          <small className="resumen-filtros-movil">
            {interpolar(buscador?.resumenMovil, {
              ciudad,
              fecha: etiquetaFecha,
            })}
          </small>
        </span>
      </label>

      <label className="campo-ciudad">
        <IconoEvento tipo="lugar" tamano={18} />
        <span>
          <span>{buscador?.etiquetas?.donde}</span>
          <select
            value={ciudad}
            onChange={(evento) => onCambiarCiudad(evento.target.value)}
          >
            {ciudades.map((opcion) => (
              <option key={opcion.nombre} value={opcion.nombre}>
                {opcion.nombre}
              </option>
            ))}
          </select>
        </span>
      </label>

      <label className="campo-fecha">
        <IconoEvento tipo="fecha" tamano={18} />
        <span>
          <span>{buscador?.etiquetas?.cuando}</span>
          <select
            value={atajo}
            onChange={(evento) => setAtajo(evento.target.value)}
          >
            <option value="">{buscador?.placeholders?.cuando}</option>
            {ATAJOS_FECHA.map((valor) => (
              <option key={valor} value={valor}>
                {fechas?.[valor]}
              </option>
            ))}
          </select>
        </span>
      </label>

      <button
        type="button"
        className="boton-filtros-buscador"
        aria-label={textos?.paginas?.explorar?.filtros?.titulo}
        aria-expanded={filtrosAbiertos}
        onClick={() => setFiltrosAbiertos((actual) => !actual)}
      >
        <Icono nombre="sliders" tamano={18} />
      </button>

      <Boton variante="primario" tamano="g" type="submit">
        {buscador?.botones?.buscar}
      </Boton>
    </form>
  );
}
