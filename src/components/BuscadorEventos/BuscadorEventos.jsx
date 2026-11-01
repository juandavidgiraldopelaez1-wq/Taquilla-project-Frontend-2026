import { useEffect, useState } from "react";
import IconoEvento from "../IconoEvento/IconoEvento.jsx";
import "./BuscadorEventos.css";
export default function BuscadorEventos({
  en,
  eventos,
  onBuscar,
  filtrosAplicados = null,
}) {
  const [consulta, setConsulta] = useState("");
  const [ciudad, setCiudad] = useState("Manizales");
  const [fecha, setFecha] = useState("");
  useEffect(() => {
    setConsulta(filtrosAplicados?.consulta ?? "");
    setCiudad(
      filtrosAplicados === null
        ? "Manizales"
        : (filtrosAplicados?.ciudad ?? ""),
    );
    setFecha(filtrosAplicados?.fecha ?? "");
  }, [filtrosAplicados]);
  function buscar(evento) {
    evento.preventDefault();
    onBuscar({ consulta, ciudad, fecha });
  }
  return (
    <form
      id="buscador-eventos"
      className="buscador-eventos"
      role="search"
      onSubmit={buscar}
      aria-label={en ? "Find events" : "Buscar eventos"}
    >
      <label>
        <IconoEvento tipo="buscar" />
        <span>
          <span>{en ? "What" : "Qué"}</span>
          <input
            type="search"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder={en ? "Event or artist" : "Evento o artista"}
          />
        </span>
      </label>
      <label>
        <IconoEvento tipo="lugar" />
        <span>
          <span>{en ? "Where" : "Dónde"}</span>
          <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
            <option value="">{en ? "All cities" : "Todas las ciudades"}</option>
            {["Manizales", "Pereira", "Bogotá", "Medellín", "Armenia"].map(
              (valor) => (
                <option key={valor}>{valor}</option>
              ),
            )}
          </select>
        </span>
      </label>
      <label>
        <IconoEvento tipo="fecha" />
        <span>
          <span>{en ? "When" : "Cuándo"}</span>
          <select value={fecha} onChange={(e) => setFecha(e.target.value)}>
            <option value="">{en ? "Any date" : "Cualquier fecha"}</option>
            {eventos.map((evento) => (
              <option key={evento.fecha} value={evento.fecha}>
                {new Date(`${evento.fecha}T12:00:00`).toLocaleDateString(
                  en ? "en" : "es-CO",
                  {
                    day: "numeric",
                    month: "short",
                  },
                )}
              </option>
            ))}
          </select>
        </span>
      </label>
      <button className="boton-home primario" type="submit">
        {en ? "Search" : "Buscar"}
      </button>
    </form>
  );
}
