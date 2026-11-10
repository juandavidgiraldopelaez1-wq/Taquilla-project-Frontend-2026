import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import LayoutPublico from "../components/LayoutPublico/LayoutPublico.jsx";
import TarjetaEvento from "../components/TarjetaEvento/TarjetaEvento.jsx";
import AficheEvento from "../components/AficheEvento/AficheEvento.jsx";
import DialogoDetalle from "../components/DialogoDetalle/DialogoDetalle.jsx";

import { usePreferencias } from "../context/PreferenciasContext.jsx";
import { useDetalle } from "../hooks/useDetalle.js";
import { useRecurso } from "../hooks/useRecurso.js";

import { consultar } from "../services/api.js";

import {
  categorias as categoriasLocales,
  categoriasEn,
  dinero,
  normalizar,
} from "../data/catalogo.js";

import "./Explorar.css";

const POR_PAGINA = 12;
const PRECIO_MINIMO = 30000;
const PRECIO_MAXIMO = 150000;
const PRECIO_ESCALA_MAXIMO = 200000;

const etiquetasCategorias = {
  conciertos: "Concierto",
  teatro: "Teatro",
  deportes: "Deportes",
  festivales: "Festival",
  comedia: "Comedia",
  familiares: "Familiar",
};

function fechaLocal(fecha) {
  if (!fecha) return "";

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(valor);
}

function horarioEvento(fecha, idioma) {
  if (!fecha) return "";

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) return "";

  return new Intl.DateTimeFormat(
    idioma === "en" ? "en-US" : "es-CO",
    {
      timeZone: "America/Bogota",
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(valor);
}

function adaptarEvento(evento, categoriasApi, idioma, indice) {
  const categoriaApi = categoriasApi.find(
    (categoria) => categoria.id === evento.categoria,
  );

  const categoriaLocal = categoriasLocales.find(
    (categoria) =>
      normalizar(categoria) === normalizar(categoriaApi?.nombre || evento.categoria),
  );

  const categoria = categoriaLocal || categoriaApi?.nombre || evento.categoria;

  const etiqueta =
    etiquetasCategorias[evento.categoria] || categoria;

  return {
    id: evento.id,
    slug: evento.slug,
    nombre: evento.titulo,
    categoria,
    etiqueta,
    fecha: fechaLocal(evento.fecha),
    horario: horarioEvento(evento.fecha, idioma),
    lugar: evento.recinto?.nombre || "",
    ciudad: evento.recinto?.ciudad || "",
    precio: evento.precioDesde || 0,
    arte: indice % 8,
    afiche: evento.afiche,
    original: evento,
  };
}

function obtenerFechaLocal(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function rangoFinDeSemana() {
  const hoy = new Date();
  const dia = hoy.getDay();

  const diasHastaSabado = (6 - dia + 7) % 7;

  const sabado = new Date(hoy);
  sabado.setDate(hoy.getDate() + diasHastaSabado);

  const domingo = new Date(sabado);
  domingo.setDate(sabado.getDate() + 1);

  return {
    desde: obtenerFechaLocal(sabado),
    hasta: obtenerFechaLocal(domingo),
  };
}

function rangoMes() {
  const hoy = new Date();

  return {
    desde: obtenerFechaLocal(
      new Date(hoy.getFullYear(), hoy.getMonth(), 1),
    ),
    hasta: obtenerFechaLocal(
      new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0),
    ),
  };
}

function ordenarEventos(eventos, orden) {
  const copia = [...eventos];

  if (orden === "precio") {
    return copia.sort((a, b) => a.precioDesde - b.precioDesde);
  }

  if (orden === "popularidad") {
    return copia.sort(
      (a, b) =>
        (b.disponibilidad?.vendidas || 0) -
        (a.disponibilidad?.vendidas || 0),
    );
  }

  return copia.sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha),
  );
}

export default function Explorar() {
  const { idioma } = usePreferencias();
  const en = idioma === "en";

  const { detalle, setDetalle, abrirCuenta } = useDetalle(idioma);

  const [searchParams, setSearchParams] = useSearchParams();
  const filtrosURL = searchParams.toString();

  const [busqueda, setBusqueda] = useState(
    searchParams.get("q") || "",
  );

  const [filtrosMovilesAbiertos, setFiltrosMovilesAbiertos] =
    useState(false);
  const [fechasPersonalizadasAbiertas, setFechasPersonalizadasAbiertas] =
    useState(() => Boolean(searchParams.get("desde") || searchParams.get("hasta")));

  const [respuestaEventos, setRespuestaEventos] = useState({
    datos: [],
    paginacion: null,
    cargando: true,
    error: null,
  });

  const {
    datos: respuestaCategorias,
    cargando: cargandoCategorias,
    error: errorCategorias,
    recargar: recargarCategorias,
  } = useRecurso("/categorias");

  const {
    datos: respuestaCiudades,
    cargando: cargandoCiudades,
    error: errorCiudades,
    recargar: recargarCiudades,
  } = useRecurso("/ciudades");

  const categoriasApi = Array.isArray(respuestaCategorias?.datos)
    ? respuestaCategorias.datos
    : [];

  const ciudadesApi = Array.isArray(respuestaCiudades?.datos)
    ? respuestaCiudades.datos
    : [];

  const categorias = useMemo(() => {
    if (categoriasApi.length) return categoriasApi;

    return categoriasLocales.map((nombre, indice) => ({
      id: normalizar(nombre),
      nombre,
      eventos: 0,
      posicion: indice,
    }));
  }, [categoriasApi]);
  const categoriasSeleccionadas = searchParams.getAll("categoria");
  const ciudad = searchParams.get("ciudad") || "";
  const consulta = searchParams.get("q") || "";
  const desde = searchParams.get("desde") || "";
  const hasta = searchParams.get("hasta") || "";
  const orden = searchParams.get("orden") || "fecha";
  const pagina = Math.max(1, Number(searchParams.get("pagina")) || 1);

  const precioMinimo = Math.min(
    PRECIO_MAXIMO - 5000,
    Math.max(
      PRECIO_MINIMO,
      Number(searchParams.get("precioMin")) || PRECIO_MINIMO,
    ),
  );

  const precioMaximo = Math.max(
    precioMinimo + 5000,
    Math.min(
      PRECIO_MAXIMO,
      Number(searchParams.get("precioMax")) || PRECIO_MAXIMO,
    ),
  );

  const posicionPrecioMinimo = `${(precioMinimo / PRECIO_ESCALA_MAXIMO) * 100}%`;
  const posicionPrecioMaximo = `${(precioMaximo / PRECIO_ESCALA_MAXIMO) * 100}%`;

  function actualizarParametros(actualizaciones = {}, opciones = {}) {
    const nuevos = new URLSearchParams(searchParams);

    Object.entries(actualizaciones).forEach(([clave, valor]) => {
      if (valor === null || valor === undefined || valor === "") {
        nuevos.delete(clave);
      } else {
        nuevos.set(clave, String(valor));
      }
    });

    if (opciones.reiniciarPagina !== false) {
      nuevos.set("pagina", "1");
    }

    setSearchParams(nuevos);
  }

  function seleccionarCategoria(id) {
    const nuevos = new URLSearchParams(searchParams);
    const seleccionadas = nuevos.getAll("categoria");

    nuevos.delete("categoria");

    const resultado = seleccionadas.includes(id)
      ? seleccionadas.filter((categoria) => categoria !== id)
      : [...seleccionadas, id];

    resultado.forEach((categoria) => {
      nuevos.append("categoria", categoria);
    });

    nuevos.set("pagina", "1");
    setSearchParams(nuevos);
  }

  function seleccionarFecha(tipo) {
    const hoy = obtenerFechaLocal(new Date());
    setFechasPersonalizadasAbiertas(false);

    if (tipo === "hoy") {
      actualizarParametros({ desde: hoy, hasta: hoy });
      return;
    }

    if (tipo === "fin-de-semana") {
      actualizarParametros(rangoFinDeSemana());
      return;
    }

    if (tipo === "mes") {
      actualizarParametros(rangoMes());
    }
  }

  function limpiarFiltros() {
    setBusqueda("");
    setFechasPersonalizadasAbiertas(false);
    setSearchParams(new URLSearchParams());
  }

  function cambiarPrecioMinimo(valor) {
    const nuevoMinimo = Math.min(
      Math.max(Number(valor), PRECIO_MINIMO),
      precioMaximo - 5000,
    );

    actualizarParametros({
      precioMin: nuevoMinimo === PRECIO_MINIMO ? "" : nuevoMinimo,
    });
  }

  function cambiarPrecioMaximo(valor) {
    const nuevoMaximo = Math.min(
      PRECIO_MAXIMO,
      Math.max(Number(valor), precioMinimo + 5000),
    );

    actualizarParametros({
      precioMax: nuevoMaximo === PRECIO_MAXIMO ? "" : nuevoMaximo,
    });
  }

  // Consulta eventos usando los filtros guardados en la URL.
  useEffect(() => {
    const controlador = new AbortController();
    let vigente = true;

    async function cargarEventos() {
      setRespuestaEventos((actual) => ({
        ...actual,
        cargando: true,
        error: null,
      }));

      try {
        const parametros = new URLSearchParams(filtrosURL);

        const categoriasSeleccionadas = parametros.getAll("categoria");
        const paginaActual = Math.max(
          1,
          Number(parametros.get("pagina")) || 1,
        );

        const precioMinimo = Math.max(
          PRECIO_MINIMO,
          Number(parametros.get("precioMin")) || PRECIO_MINIMO,
        );

        parametros.delete("categoria");
        parametros.delete("precioMin");
        parametros.delete("pagina");
        parametros.delete("porPagina");

        if (categoriasSeleccionadas.length > 1) {
          // La API recibe una categoría por petición.
          // Se consultan por separado y se unen los resultados.
          const respuestas = await Promise.all(
            categoriasSeleccionadas.map(async (categoria) => {
              const consulta = new URLSearchParams(parametros);
              consulta.set("categoria", categoria);
              consulta.set("pagina", "1");
              consulta.set("porPagina", "100");

              return consultar(`/eventos?${consulta.toString()}`, {
                signal: controlador.signal,
              });
            }),
          );

          const unicos = new Map();

          respuestas.forEach((respuesta) => {
            (respuesta.datos || []).forEach((evento) => {
              unicos.set(evento.id, evento);
            });
          });

          let eventos = ordenarEventos(
            [...unicos.values()].filter(
              (evento) => (evento.precioDesde || 0) >= precioMinimo,
            ),
            parametros.get("orden") || "fecha",
          );

          const total = eventos.length;
          const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));

          const paginaSegura = Math.min(paginaActual, paginas);
          const inicio = (paginaSegura - 1) * POR_PAGINA;

          eventos = eventos.slice(inicio, inicio + POR_PAGINA);

          if (vigente) {
            setRespuestaEventos({
              datos: eventos,
              paginacion: {
                pagina: paginaSegura,
                porPagina: POR_PAGINA,
                total,
                paginas,
              },
              cargando: false,
              error: null,
            });
          }
        } else {
          if (categoriasSeleccionadas.length === 1) {
            parametros.set("categoria", categoriasSeleccionadas[0]);
          }

          parametros.set("pagina", String(paginaActual));
          parametros.set("porPagina", String(POR_PAGINA));

          const respuesta = await consultar(
            `/eventos?${parametros.toString()}`,
            { signal: controlador.signal },
          );

          const eventos = (respuesta.datos || []).filter(
            (evento) => (evento.precioDesde || 0) >= precioMinimo,
          );

          if (vigente) {
            setRespuestaEventos({
              datos: eventos,
              paginacion: respuesta.paginacion,
              cargando: false,
              error: null,
            });
          }
        }
      } catch (error) {
        if (vigente && error.name !== "AbortError") {
          setRespuestaEventos({
            datos: [],
            paginacion: null,
            cargando: false,
            error,
          });
        }
      }
    }

    cargarEventos();

    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [filtrosURL]);
  useEffect(() => {
    setBusqueda(consulta);
  }, [consulta]);

  const eventos = respuestaEventos.datos.map((evento, indice) =>
    adaptarEvento(evento, categorias, idioma, indice),
  );

  const totalEventos = respuestaEventos.paginacion?.total ?? 0;
  const totalPaginas = respuestaEventos.paginacion?.paginas ?? 1;

  const hayFiltros =
    categoriasSeleccionadas.length > 0 ||
    ciudad ||
    consulta ||
    desde ||
    hasta ||
    precioMinimo > PRECIO_MINIMO ||
    precioMaximo < PRECIO_MAXIMO;

  const etiquetaFecha = useMemo(() => {
    if (!desde && !hasta) return "";

    const hoy = obtenerFechaLocal(new Date());
    const finDeSemana = rangoFinDeSemana();
    const mes = rangoMes();

    if (desde === hoy && hasta === hoy) {
      return en ? "Today" : "Hoy";
    }

    if (
      desde === finDeSemana.desde &&
      hasta === finDeSemana.hasta
    ) {
      return en ? "This weekend" : "Este fin de semana";
    }

    if (desde === mes.desde && hasta === mes.hasta) {
      return en ? "This month" : "Este mes";
    }

    return en ? "Custom dates" : "Fechas elegidas";
  }, [desde, hasta, en]);



  function abrirEvento(evento) {
    const original = evento.original;

    setDetalle({
      titulo: evento.nombre,
      descripcion: `${evento.horario} · ${evento.lugar}, ${evento.ciudad}`,
      contenido: (
        <div className="resumen-evento">
          <AficheEvento variante={evento.arte} />

          <p>{dinero(evento.precio)} COP</p>

          {original?.disponibilidad && (
            <small>
              {en
                ? `${original.disponibilidad.disponibles} tickets available`
                : `${original.disponibilidad.disponibles} entradas disponibles`}
            </small>
          )}
        </div>
      ),
      cerrar: en ? "Close" : "Cerrar",
    });
  }

  const numeroPagina = respuestaEventos.paginacion?.pagina || pagina;

  return (
    <LayoutPublico
      destino="/explorar"
      etiqueta={en ? "Explore" : "Explorar"}
      descripcion={
        en
          ? "Find concerts, theater, sports and more."
          : "Encuentra conciertos, teatro, deportes y mucho más."
      }
      onCuenta={abrirCuenta}
    >
      <div className="pagina-explorar">
        <div className="ancho-explorar">
          <nav className="migas-explorar" aria-label={en ? "Breadcrumb" : "Ruta de navegación"}>
            <a href="/">{en ? "Home" : "Inicio"}</a>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{en ? "Explore" : "Explorar"}</span>
          </nav>

          <header className="encabezado-explorar">
            <h1>{en ? "Explore events" : "Explorar eventos"}</h1>
            <p role="status">
              {respuestaEventos.cargando
                ? en
                  ? "Loading events..."
                  : "Cargando eventos..."
                : `${totalEventos} ${en ? "events match your filters" : "eventos coinciden con tus filtros"
                }`}
            </p>
          </header>

          <button
            type="button"
            className="boton-filtros-movil"
            aria-expanded={filtrosMovilesAbiertos}
            onClick={() =>
              setFiltrosMovilesAbiertos((actual) => !actual)
            }
          >
            {en ? "Filters" : "Filtros"}
            <span>{filtrosMovilesAbiertos ? "−" : "+"}</span>
          </button>

          <div className="contenido-explorar">
            <aside
              className={`panel-filtros ${filtrosMovilesAbiertos ? "filtros-abiertos" : ""
                }`}
              aria-label={en ? "Event filters" : "Filtros de eventos"}
            >
              <div className="encabezado-filtros">
                <h2>{en ? "Filters" : "Filtros"}</h2>

                <button type="button" onClick={limpiarFiltros}>
                  {en ? "Clear" : "Limpiar"}
                </button>
              </div>

              <section className="grupo-filtro">
                <h3>{en ? "Category" : "Categoría"}</h3>

                {categorias.map((categoria, indice) => {
                  const seleccionada = categoriasSeleccionadas.includes(
                    categoria.id,
                  );

                  const nombreEn =
                    categoriasEn[
                    categoriasLocales.findIndex(
                      (nombre) =>
                        normalizar(nombre) ===
                        normalizar(categoria.nombre),
                    )
                    ];

                  return (
                    <label
                      className="opcion-categoria"
                      key={categoria.id}
                    >
                      <input
                        type="checkbox"
                        checked={seleccionada}
                        onChange={() =>
                          seleccionarCategoria(categoria.id)
                        }
                      />

                      <span>
                        {en ? nombreEn || categoria.nombre : categoria.nombre}
                      </span>

                      <small>
                        {categoria.eventos ?? "—"}
                      </small>
                    </label>
                  );
                })}

                {errorCategorias && (
                  <button
                    type="button"
                    className="reintentar-filtro"
                    onClick={recargarCategorias}
                  >
                    {en ? "Retry categories" : "Reintentar categorías"}
                  </button>
                )}

                {cargandoCategorias && (
                  <small>{en ? "Loading..." : "Cargando..."}</small>
                )}
              </section>

              <section className="grupo-filtro filtro-fechas">
                <h3>{en ? "Date" : "Fecha"}</h3>

                <div className="opciones-fecha">
                  <button
                    type="button"
                    className={
                      etiquetaFecha === (en ? "Today" : "Hoy")
                        ? "seleccionado"
                        : ""
                    }
                    onClick={() => seleccionarFecha("hoy")}
                  >
                    {en ? "Today" : "Hoy"}
                  </button>

                  <button
                    type="button"
                    className={
                      etiquetaFecha ===
                        (en ? "This weekend" : "Este fin de semana")
                        ? "seleccionado"
                        : ""
                    }
                    onClick={() => seleccionarFecha("fin-de-semana")}
                  >
                    {en ? "This weekend" : "Este fin de semana"}
                  </button>

                  <button
                    type="button"
                    className={
                      etiquetaFecha === (en ? "This month" : "Este mes")
                        ? "seleccionado"
                        : ""
                    }
                    onClick={() => seleccionarFecha("mes")}
                  >
                    {en ? "This month" : "Este mes"}
                  </button>

                  <button
                    type="button"
                    className={
                      fechasPersonalizadasAbiertas ||
                        etiquetaFecha === (en ? "Custom dates" : "Fechas elegidas")
                        ? "seleccionado"
                        : ""
                    }
                    aria-expanded={fechasPersonalizadasAbiertas}
                    onClick={() => {
                      if (fechasPersonalizadasAbiertas) {
                        setFechasPersonalizadasAbiertas(false);
                        return;
                      }

                      setFechasPersonalizadasAbiertas(true);

                      if (
                        etiquetaFecha === (en ? "Today" : "Hoy") ||
                        etiquetaFecha === (en ? "This weekend" : "Este fin de semana") ||
                        etiquetaFecha === (en ? "This month" : "Este mes")
                      ) {
                        actualizarParametros({ desde: "", hasta: "" });
                      }
                    }}
                  >
                    {en ? "Choose dates" : "Elegir fechas"}
                  </button>
                </div>

                {fechasPersonalizadasAbiertas && (
                  <div className="fechas-personalizadas">
                    <label>
                      <span>{en ? "From" : "Desde"}</span>
                      <input
                        type="date"
                        value={desde}
                        onChange={(evento) =>
                          actualizarParametros({ desde: evento.target.value })
                        }
                      />
                    </label>

                    <label>
                      <span>{en ? "To" : "Hasta"}</span>
                      <input
                        type="date"
                        min={desde || undefined}
                        value={hasta}
                        onChange={(evento) =>
                          actualizarParametros({ hasta: evento.target.value })
                        }
                      />
                    </label>
                  </div>
                )}
              </section>

              <section className="grupo-filtro">
                <h3>{en ? "City" : "Ciudad"}</h3>

                <select
                  value={ciudad}
                  onChange={(evento) =>
                    actualizarParametros({ ciudad: evento.target.value })
                  }
                  aria-label={en ? "Filter by city" : "Filtrar por ciudad"}
                >
                  <option value="">
                    {en ? "All cities" : "Todas las ciudades"}
                  </option>

                  {ciudadesApi.map((item) => (
                    <option key={item.nombre} value={item.nombre}>
                      {item.nombre}
                    </option>
                  ))}
                </select>

                {errorCiudades && (
                  <button
                    type="button"
                    className="reintentar-filtro"
                    onClick={recargarCiudades}
                  >
                    {en ? "Retry cities" : "Reintentar ciudades"}
                  </button>
                )}

                {cargandoCiudades && (
                  <small>{en ? "Loading..." : "Cargando..."}</small>
                )}
              </section>

              <section className="grupo-filtro filtro-precio">
                <h3>{en ? "Price" : "Precio"}</h3>

                <div
                  className="controles-precio"
                  style={{
                    "--precio-inicio": posicionPrecioMinimo,
                    "--precio-fin": posicionPrecioMaximo,
                  }}
                >
                  <input
                    className="rango-precio rango-precio-minimo"
                    type="range"
                    min="0"
                    max={PRECIO_ESCALA_MAXIMO}
                    step="5000"
                    value={precioMinimo}
                    aria-label={en ? "Minimum price" : "Precio mínimo"}
                    aria-valuetext={dinero(precioMinimo)}
                    onChange={(evento) =>
                      cambiarPrecioMinimo(evento.target.value)
                    }
                  />

                  <input
                    className="rango-precio rango-precio-maximo"
                    type="range"
                    min="0"
                    max={PRECIO_ESCALA_MAXIMO}
                    step="5000"
                    value={precioMaximo}
                    aria-label={en ? "Maximum price" : "Precio máximo"}
                    aria-valuetext={dinero(precioMaximo)}
                    onChange={(evento) =>
                      cambiarPrecioMaximo(evento.target.value)
                    }
                  />
                </div>

                <div className="etiquetas-precio">
                  <span>{dinero(precioMinimo)}</span>
                  <span>{dinero(precioMaximo)}</span>
                </div>
              </section>
            </aside>

            <section className="resultados-explorar">
              <div className="barra-resultados">
                {(
                  categoriasSeleccionadas.length > 0 ||
                  etiquetaFecha ||
                  ciudad ||
                  consulta
                ) && (
                    <div className="filtros-activos">
                      {categoriasSeleccionadas.map((id) => {
                        const categoria = categorias.find(
                          (item) => String(item.id) === String(id)
                        );

                        const nombre = categoria?.nombre || id;

                        return (
                          <button
                            type="button"
                            key={id}
                            onClick={() => seleccionarCategoria(id)}
                            aria-label={`${en ? "Remove filter" : "Quitar filtro"}: ${nombre}`}
                          >
                            {nombre}
                            <span aria-hidden="true">×</span>
                          </button>
                        );
                      })}

                      {etiquetaFecha && (
                        <button
                          type="button"
                          onClick={() => {
                            setFechasPersonalizadasAbiertas(false);
                            actualizarParametros({ desde: "", hasta: "" });
                          }}
                        >
                          {etiquetaFecha}
                          <span aria-hidden="true">×</span>
                        </button>
                      )}

                      {ciudad && (
                        <button
                          type="button"
                          onClick={() => actualizarParametros({ ciudad: "" })}
                        >
                          {ciudad}
                          <span aria-hidden="true">×</span>
                        </button>
                      )}

                      {consulta && (
                        <button
                          type="button"
                          onClick={() => {
                            setBusqueda("");
                            actualizarParametros({ q: "" });
                          }}
                        >
                          {consulta}
                          <span aria-hidden="true">×</span>
                        </button>
                      )}
                    </div>
                  )}

                <label className="orden-resultados">
                  <span>{en ? "Sort:" : "Ordenar:"}</span>

                  <select
                    value={orden}
                    onChange={(evento) =>
                      actualizarParametros({ orden: evento.target.value })
                    }
                  >
                    <option value="fecha">
                      {en ? "Nearest date" : "Fecha más próxima"}
                    </option>
                    <option value="precio">
                      {en ? "Lowest price" : "Menor precio"}
                    </option>
                    <option value="popularidad">
                      {en ? "Most popular" : "Más populares"}
                    </option>
                  </select>
                </label>
              </div>
              {respuestaEventos.error && (
                <div className="estado-explorar" role="alert">
                  <h2>
                    {en
                      ? "Events could not be loaded"
                      : "No pudimos cargar los eventos"}
                  </h2>

                  <p>
                    {respuestaEventos.error.message}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchParams(new URLSearchParams(searchParams));
                    }}
                  >
                    {en ? "Try again" : "Reintentar"}
                  </button>
                </div>
              )}

              {respuestaEventos.cargando && (
                <p className="estado-cargando" role="status">
                  {en ? "Loading events..." : "Cargando eventos..."}
                </p>
              )}

              {!respuestaEventos.cargando &&
                !respuestaEventos.error &&
                eventos.length > 0 && (
                  <div className="eventos-explorar-grid">
                    {eventos.map((evento) => (
                      <TarjetaEvento
                        key={evento.id}
                        evento={evento}
                        en={en}
                        onAbrir={abrirEvento}
                      />
                    ))}
                  </div>
                )}

              {!respuestaEventos.cargando &&
                !respuestaEventos.error &&
                eventos.length === 0 && (
                  <div className="sin-resultados">
                    <h2>
                      {en ? "No events found" : "No encontramos eventos"}
                    </h2>

                    <p>
                      {en
                        ? "Try changing or clearing your filters."
                        : "Prueba cambiando o limpiando tus filtros."}
                    </p>

                    <button
                      type="button"
                      className="boton-home primario"
                      onClick={limpiarFiltros}
                    >
                      {en ? "Clear filters" : "Limpiar filtros"}
                    </button>
                  </div>
                )}

              {!respuestaEventos.cargando &&
                !respuestaEventos.error &&
                totalPaginas > 1 && (
                  <nav
                    className="paginacion-explorar"
                    aria-label={en ? "Pagination" : "Paginación"}
                  >
                    <button
                      type="button"
                      disabled={numeroPagina <= 1}
                      onClick={() =>
                        actualizarParametros(
                          { pagina: numeroPagina - 1 },
                          { reiniciarPagina: false },
                        )
                      }
                      aria-label={en ? "Previous page" : "Página anterior"}
                    >
                      ‹
                    </button>

                    {Array.from(
                      { length: totalPaginas },
                      (_, indice) => indice + 1,
                    )
                      .filter(
                        (numero) =>
                          numero === 1 ||
                          numero === totalPaginas ||
                          Math.abs(numero - numeroPagina) <= 1,
                      )
                      .map((numero, indice, lista) => (
                        <span key={numero}>
                          {indice > 0 &&
                            numero - lista[indice - 1] > 1 && (
                              <span className="separador-paginacion">
                                …
                              </span>
                            )}

                          <button
                            type="button"
                            className={
                              numero === numeroPagina ? "pagina-activa" : ""
                            }
                            aria-current={
                              numero === numeroPagina ? "page" : undefined
                            }
                            onClick={() =>
                              actualizarParametros(
                                { pagina: numero },
                                { reiniciarPagina: false },
                              )
                            }
                          >
                            {numero}
                          </button>
                        </span>
                      ))}

                    <button
                      type="button"
                      disabled={numeroPagina >= totalPaginas}
                      onClick={() =>
                        actualizarParametros(
                          { pagina: numeroPagina + 1 },
                          { reiniciarPagina: false },
                        )
                      }
                      aria-label={en ? "Next page" : "Página siguiente"}
                    >
                      ›
                    </button>
                  </nav>
                )}
            </section>
          </div>
        </div>
      </div>

      <DialogoDetalle
        detalle={detalle}
        onCerrar={() => setDetalle(null)}
      />
    </LayoutPublico>
  );
}
