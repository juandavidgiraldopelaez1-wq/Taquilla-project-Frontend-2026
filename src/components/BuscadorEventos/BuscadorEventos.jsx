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
  const [esMovil, setEsMovil] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");

    function actualizarVista(evento) {
      setEsMovil(evento.matches);
    }

    setEsMovil(media.matches);
    media.addEventListener("change", actualizarVista);

    return () => {
      media.removeEventListener("change", actualizarVista);
    };
  }, []);

  const [filtrosMovilesAbiertos, setFiltrosMovilesAbiertos] =
    useState(false);

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
    setFiltrosMovilesAbiertos(false);
  }

  const etiquetaFecha = fecha
    ? new Intl.DateTimeFormat(en ? "en-US" : "es-CO", {
      day: "numeric",
      month: "short",
    }).format(new Date(`${fecha}T12:00:00`))
    : en
      ? "Any date"
      : "Cualquier fecha";

  const resumenFiltros = `${ciudad || (en ? "All cities" : "Todas las ciudades")
    } · ${etiquetaFecha}`;

  return (
    <form
      id="buscador-eventos"
      className={`buscador-eventos ${filtrosMovilesAbiertos ? "filtros-moviles-abiertos" : ""
        }`}
      role="search"
      onSubmit={buscar}
      aria-label={en ? "Find events" : "Buscar eventos"}
    >
      <label className="campo-consulta">
        <IconoEvento tipo="buscar" />

        <span>
          <span>{en ? "What" : "Qué"}</span>

          <input
            type="search"
            value={consulta}
            onChange={(evento) => setConsulta(evento.target.value)}
            placeholder={
              en
                ? (esMovil ? "Event, artist or place" : "Event or artist")
                : (esMovil ? "Evento, artista o lugar" : "Evento o artista")
            }
          />

          <small className="resumen-filtros-movil">
            {resumenFiltros}
          </small>
        </span>
      </label>

      <label className="campo-ciudad">
        <IconoEvento tipo="lugar" />

        <span>
          <span>{en ? "Where" : "Dónde"}</span>

          <select
            value={ciudad}
            onChange={(evento) => setCiudad(evento.target.value)}
          >
            <option value="">
              {en ? "All cities" : "Todas las ciudades"}
            </option>

            {["Manizales", "Pereira", "Bogotá", "Medellín", "Armenia"].map(
              (valor) => (
                <option key={valor} value={valor}>
                  {valor}
                </option>
              ),
            )}
          </select>
        </span>
      </label>

      <label className="campo-fecha">
        <IconoEvento tipo="fecha" />

        <span>
          <span>{en ? "When" : "Cuándo"}</span>

          <select
            value={fecha}
            onChange={(evento) => setFecha(evento.target.value)}
          >
            <option value="">
              {en ? "Any date" : "Cualquier fecha"}
            </option>

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

      <button
        type="button"
        className="boton-filtros-buscador"
        aria-label={en ? "Search filters" : "Filtros de búsqueda"}
        aria-expanded={filtrosMovilesAbiertos}
        onClick={() =>
          setFiltrosMovilesAbiertos((actual) => !actual)
        }
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            width="40"
            height="40"
            rx="20"
            fill="#F0F0F0"
          />
          <path
            d="M14 26.75V21.5M14 21.5H12.5M14 21.5H15.5M14 18.5V13.25M20 26.75V20M20 17V13.25M20 17H18.5M20 17H21.5M26 26.75V23M26 23H24.5M26 23H27.5M26 20V13.25"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#141414"
          />
        </svg>
      </button>

      <button className="boton-home primario" type="submit">
        {en ? "Search" : "Buscar"}
      </button>
    </form>
  );
}