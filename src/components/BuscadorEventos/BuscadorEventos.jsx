import { useEffect, useState } from "react";
import IconoEvento from "../IconoEvento/IconoEvento.jsx";
import "./BuscadorEventos.css";
import Boton from "../Boton/Boton.jsx";
import Icono from "../Icono/Icono.jsx";

const CONSULTA_MOVIL = "(max-width: 640px)";

function ciudadInicial(filtrosAplicados) {
  return filtrosAplicados === null
    ? "Manizales"
    : (filtrosAplicados?.ciudad ?? "");
}

export default function BuscadorEventos({
  en,
  eventos,
  textos,
  onBuscar,
  filtrosAplicados = null,
}) {
  const [consulta, setConsulta] = useState(
    () => filtrosAplicados?.consulta ?? "",
  );
  const [ciudad, setCiudad] = useState(() => ciudadInicial(filtrosAplicados));
  const [fecha, setFecha] = useState(() => filtrosAplicados?.fecha ?? "");
  const [filtrosPrevios, setFiltrosPrevios] = useState(filtrosAplicados);
  const [esMovil, setEsMovil] = useState(
    () => window.matchMedia(CONSULTA_MOVIL).matches,
  );
  const [filtrosMovilesAbiertos, setFiltrosMovilesAbiertos] = useState(false);

  const buscador = textos?.paginas?.inicio?.hero?.buscador;
  const etiquetas = buscador?.etiquetas;
  const placeholders = buscador?.placeholders;

  const textoBuscar = buscador?.botones?.buscar ?? (en ? "Search" : "Buscar");

  const textoCiudadTodas = en ? "All cities" : "Todas las ciudades";

  useEffect(() => {
    const media = window.matchMedia(CONSULTA_MOVIL);

    function actualizarVista(evento) {
      setEsMovil(evento.matches);
    }

    media.addEventListener("change", actualizarVista);

    return () => {
      media.removeEventListener("change", actualizarVista);
    };
  }, []);

  // Si cambian los filtros aplicados desde afuera, se reflejan en el formulario.
  if (filtrosPrevios !== filtrosAplicados) {
    setFiltrosPrevios(filtrosAplicados);
    setConsulta(filtrosAplicados?.consulta ?? "");
    setCiudad(ciudadInicial(filtrosAplicados));
    setFecha(filtrosAplicados?.fecha ?? "");
  }

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
    : (placeholders?.cuando ?? (en ? "Any date" : "Cualquier fecha"));

  const plantillaResumen = buscador?.resumenMovil ?? "{ciudad} · {fecha}";

  const resumenFiltros = plantillaResumen
    .replace("{ciudad}", ciudad || textoCiudadTodas)
    .replace("{fecha}", etiquetaFecha);

  return (
    <form
      id="buscador-eventos"
      className={`buscador-eventos ${
        filtrosMovilesAbiertos ? "filtros-moviles-abiertos" : ""
      }`}
      role="search"
      onSubmit={buscar}
      aria-label={en ? "Find events" : "Buscar eventos"}
    >
      <label className="campo-consulta">
        <IconoEvento tipo="buscar" />

        <span>
          <span>{etiquetas?.que ?? (en ? "What" : "Qué")}</span>

          <input
            type="search"
            value={consulta}
            onChange={(evento) => setConsulta(evento.target.value)}
            placeholder={
              esMovil
                ? (placeholders?.movil ??
                  (en ? "Event, artist or venue" : "Evento, artista o lugar"))
                : (placeholders?.que ??
                  (en ? "Event or artist" : "Evento o artista"))
            }
          />

          <small className="resumen-filtros-movil">{resumenFiltros}</small>
        </span>
      </label>

      <label className="campo-ciudad">
        <IconoEvento tipo="lugar" />

        <span>
          <span>{etiquetas?.donde ?? (en ? "Where" : "Dónde")}</span>

          <select
            value={ciudad}
            onChange={(evento) => setCiudad(evento.target.value)}
          >
            <option value="">{textoCiudadTodas}</option>

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
          <span>{etiquetas?.cuando ?? (en ? "When" : "Cuándo")}</span>

          <select
            value={fecha}
            onChange={(evento) => setFecha(evento.target.value)}
          >
            <option value="">
              {placeholders?.cuando ?? (en ? "Any date" : "Cualquier fecha")}
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
        onClick={() => setFiltrosMovilesAbiertos((actual) => !actual)}
      >
        <Icono nombre="sliders" tamano={18} />
      </button>

      <Boton variante="primario" type="submit">
        {textoBuscar}
      </Boton>
    </form>
  );
}
