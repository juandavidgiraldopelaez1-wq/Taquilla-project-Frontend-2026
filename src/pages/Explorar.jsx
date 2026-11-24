import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";

import LayoutPublico from "../components/LayoutPublico/LayoutPublico.jsx";
import TarjetaEvento from "../components/TarjetaEvento/TarjetaEvento.jsx";
import Boton from "../components/Boton/Boton.jsx";
import Icono from "../components/Icono/Icono.jsx";
import EstadoCarga from "../components/EstadoCarga/EstadoCarga.jsx";
import EstadoError from "../components/EstadoError/EstadoError.jsx";
import EstadoVacio from "../components/EstadoVacio/EstadoVacio.jsx";

import { useEsMovil } from "../hooks/useEsMovil.js";
import { usePreferencias } from "../hooks/usePreferencias.js";
import { useRecurso } from "../hooks/useRecurso.js";

import { consultar } from "../services/api.js";

import { textosFaltantes } from "../config/textosFaltantes.js";
import { formatoPrecio, interpolar, plural } from "../utils/formato.js";
import { atajoDeRango, rangoFecha } from "../utils/filtros.js";

import "./Explorar.css";

const POR_PAGINA = 12;
// El rango de precio va de $0 al evento más caro del catálogo (dato de la API),
// en pasos de $5.000.
const PRECIO_PASO = 5000;

// Hasta este ancho los filtros se abren como panel (Figma «filtros abiertos — Móvil»).
// Debe coincidir con el @media de Explorar.css.
const CONSULTA_PANEL_FILTROS = "(max-width: 1024px)";

function ordenarEventos(eventos, orden) {
  const copia = [...eventos];

  if (orden === "precio") {
    return copia.sort((a, b) => a.precioDesde - b.precioDesde);
  }

  if (orden === "popularidad") {
    return copia.sort(
      (a, b) =>
        (b.disponibilidad?.vendidas || 0) - (a.disponibilidad?.vendidas || 0),
    );
  }

  return copia.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

export default function Explorar() {
  const { idioma, textos } = usePreferencias();

  const faltantes = textosFaltantes[idioma];

  // Textos obtenidos de GET /textos?idioma=es|en.
  const explorar = textos?.paginas?.explorar;
  const general = textos?.general;
  const estados = textos?.estados;

  const filtrosTexto = explorar?.filtros;
  const fechasTexto = filtrosTexto?.fecha;
  const acciones = general?.acciones;
  const categoriasTexto = general?.categorias;

  const [searchParams, setSearchParams] = useSearchParams();
  const filtrosURL = searchParams.toString();

  const [busqueda, setBusqueda] = useState(searchParams.get("q") || "");

  const [filtrosMovilesAbiertos, setFiltrosMovilesAbiertos] = useState(false);

  // En pantallas anchas los filtros siempre se ven en la columna izquierda,
  // así que el panel solo cuenta como abierto en celular y tableta.
  const filtrosComoPanel = useEsMovil(CONSULTA_PANEL_FILTROS);
  const panelAbierto = filtrosComoPanel && filtrosMovilesAbiertos;

  const botonFiltrosRef = useRef(null);
  const cerrarPanelRef = useRef(null);

  const [fechasPersonalizadasAbiertas, setFechasPersonalizadasAbiertas] =
    useState(() =>
      Boolean(searchParams.get("desde") || searchParams.get("hasta")),
    );

  // Sube con «Reintentar» para repetir la consulta con los mismos filtros.
  const [intento, setIntento] = useState(0);

  const [respuestaEventos, setRespuestaEventos] = useState({
    datos: [],
    paginacion: null,
    cargando: true,
    error: null,
  });

  // Actualiza el título y la descripción del navegador.
  useEffect(() => {
    if (explorar?.seo?.titulo) {
      document.title = explorar.seo.titulo;
    }
  }, [explorar?.seo?.titulo]);

  // Obtener categorías desde la API.
  const {
    datos: respuestaCategorias,
    cargando: cargandoCategorias,
    error: errorCategorias,
    recargar: recargarCategorias,
  } = useRecurso("/categorias");

  // Obtener ciudades desde la API.
  const {
    datos: respuestaCiudades,
    cargando: cargandoCiudades,
    error: errorCiudades,
    recargar: recargarCiudades,
  } = useRecurso("/ciudades");

  // Precio más alto del catálogo. La API no lo entrega directo: se pide el
  // total de eventos y luego el último ordenado por precio (de menor a mayor).
  const { datos: respuestaConteo } = useRecurso("/eventos?porPagina=1", {
    cache: true,
  });
  const totalCatalogo = respuestaConteo?.paginacion?.total;

  const { datos: respuestaMasCaro } = useRecurso(
    totalCatalogo
      ? `/eventos?orden=precio&porPagina=1&pagina=${totalCatalogo}`
      : null,
    { cache: true },
  );

  const precioMasAlto = respuestaMasCaro?.datos?.[0]?.precioDesde;
  const precioTope = precioMasAlto
    ? Math.ceil(precioMasAlto / PRECIO_PASO) * PRECIO_PASO
    : null;

  const ciudadesApi = Array.isArray(respuestaCiudades?.datos)
    ? respuestaCiudades.datos
    : [];

  const categorias = respuestaCategorias?.datos ?? [];

  const categoriasSeleccionadas = searchParams.getAll("categoria");
  const ciudad = searchParams.get("ciudad") || "";
  const consulta = searchParams.get("q") || "";
  const desde = searchParams.get("desde") || "";
  const hasta = searchParams.get("hasta") || "";
  const orden = searchParams.get("orden") || "fecha";

  const pagina = Math.max(1, Number(searchParams.get("pagina")) || 1);

  // Mientras llega el precio más alto, el rango usa lo que haya en la URL.
  const escalaPrecio =
    precioTope ?? (Number(searchParams.get("precioMax")) || PRECIO_PASO);

  const precioMinimo = Math.min(
    Math.max(0, escalaPrecio - PRECIO_PASO),
    Math.max(0, Number(searchParams.get("precioMin")) || 0),
  );

  const precioMaximo = Math.max(
    precioMinimo + PRECIO_PASO,
    Math.min(
      escalaPrecio,
      Number(searchParams.get("precioMax")) || escalaPrecio,
    ),
  );

  const posicionPrecioMinimo = `${(precioMinimo / escalaPrecio) * 100}%`;

  const posicionPrecioMaximo = `${(precioMaximo / escalaPrecio) * 100}%`;

  // Actualizar los parámetros de búsqueda sin perder filtros.
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

  // Permitir seleccionar varias categorías.
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

  // Seleccionar fechas rápidas.
  function seleccionarFecha(tipo) {
    setFechasPersonalizadasAbiertas(false);

    if (tipo === "hoy") {
      actualizarParametros(rangoFecha("hoy"));
      return;
    }

    if (tipo === "fin-de-semana") {
      actualizarParametros(rangoFecha("finDeSemana"));
      return;
    }

    if (tipo === "mes") {
      actualizarParametros(rangoFecha("mes"));
    }
  }

  // Limpiar todos los filtros.
  function limpiarFiltros() {
    setBusqueda("");
    setFechasPersonalizadasAbiertas(false);
    setSearchParams(new URLSearchParams());
  }

  // Buscar desde el encabezado responsive sin alterar los demás filtros.
  function buscarPorTexto(evento) {
    evento.preventDefault();

    actualizarParametros({
      q: busqueda.trim(),
    });
  }

  // En los extremos ($0 y el tope) el filtro se quita de la URL.
  function cambiarPrecioMinimo(valor) {
    const nuevoMinimo = Math.min(
      Math.max(Number(valor), 0),
      precioMaximo - PRECIO_PASO,
    );

    actualizarParametros({
      precioMin: nuevoMinimo <= 0 ? "" : nuevoMinimo,
    });
  }

  function cambiarPrecioMaximo(valor) {
    const nuevoMaximo = Math.min(
      escalaPrecio,
      Math.max(Number(valor), precioMinimo + PRECIO_PASO),
    );

    actualizarParametros({
      precioMax: nuevoMaximo >= escalaPrecio ? "" : nuevoMaximo,
    });
  }

  // Consultar eventos utilizando los filtros guardados en la URL.
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

        const paginaActual = Math.max(1, Number(parametros.get("pagina")) || 1);

        // La API no tiene «precioMin»: si la persona lo elige, se filtra aquí.
        // Sin elegirlo no se oculta ningún evento.
        const precioMinimo = Number(parametros.get("precioMin")) || 0;

        parametros.delete("categoria");
        parametros.delete("precioMin");
        parametros.delete("pagina");
        parametros.delete("porPagina");

        // Se filtra y pagina aquí cuando la API no puede hacerlo sola:
        // varias categorías (recibe una por petición) o precio mínimo
        // (no existe «precioMin»). Así el conteo y las páginas son correctos.
        if (categoriasSeleccionadas.length > 1 || precioMinimo > 0) {
          const categoriasConsulta =
            categoriasSeleccionadas.length > 0 ? categoriasSeleccionadas : [""];

          const respuestas = await Promise.all(
            categoriasConsulta.map(async (categoria) => {
              const consulta = new URLSearchParams(parametros);

              if (categoria) consulta.set("categoria", categoria);
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

          const eventos = respuesta.datos || [];

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
  }, [filtrosURL, intento]);

  // Panel de filtros en celular: bloquea el scroll de fondo, cierra con Escape
  // y devuelve el foco al botón que lo abrió.
  useEffect(() => {
    if (!panelAbierto) return undefined;

    const botonFiltros = botonFiltrosRef.current;
    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    cerrarPanelRef.current?.focus();

    function alPresionarTecla(evento) {
      if (evento.key === "Escape") setFiltrosMovilesAbiertos(false);
    }

    document.addEventListener("keydown", alPresionarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", alPresionarTecla);
      botonFiltros?.focus();
    };
  }, [panelAbierto]);

  // Si cambia la búsqueda en la URL, se refleja en el campo de texto.
  const [consultaPrevia, setConsultaPrevia] = useState(consulta);
  if (consultaPrevia !== consulta) {
    setConsultaPrevia(consulta);
    setBusqueda(consulta);
  }

  // Adaptar los eventos recibidos.
  const eventos = respuestaEventos.datos;

  const totalEventos = respuestaEventos.paginacion?.total ?? 0;

  const totalPaginas = respuestaEventos.paginacion?.paginas ?? 1;

  // Identificar el tipo de fecha seleccionado.
  const estadoFecha = atajoDeRango(desde, hasta);

  const etiquetaFecha =
    estadoFecha === "hoy"
      ? fechasTexto?.hoy
      : estadoFecha === "finDeSemana"
        ? fechasTexto?.finDeSemana
        : estadoFecha === "mes"
          ? fechasTexto?.mes
          : estadoFecha === "personalizada"
            ? fechasTexto?.elegir
            : "";

  const numeroPagina = respuestaEventos.paginacion?.pagina || pagina;

  // Textos para la interfaz de explorar.
  const tituloPagina = explorar?.seo?.titulo?.replace(
    /\s*[·|—-]\s*Taquilla\s*$/,
    "",
  );

  const resultadosTexto = plural(explorar?.resultados, totalEventos);

  // Texto compacto para la fila de resultados en móvil y tablet.
  const resultadosCorto = plural(explorar?.resultadosCorto, totalEventos);

  const textoCargando = estados?.cargando?.indicador;

  const textoReintentar =
    estados?.error?.botones?.reintentar ?? acciones?.reintentar;

  const tituloVacio = explorar?.vacio?.titulo;

  const descripcionVacio = explorar?.vacio?.texto;

  const botonLimpiarVacio = explorar?.vacio?.botones?.limpiar;

  const tituloFiltros = filtrosTexto?.titulo;

  const tituloCategoria = filtrosTexto?.categoria;

  const tituloCiudad = filtrosTexto?.ciudad;

  const tituloPrecio = filtrosTexto?.precio;

  const textoLimpiar = filtrosTexto?.botones?.limpiar ?? acciones?.limpiar;

  const textoTodasCiudades = faltantes.todasLasCiudades;

  const textoDesde = faltantes.fechaDesde;
  const textoHasta = faltantes.fechaHasta;

  const etiquetaOrden = explorar?.orden?.etiqueta;

  const opcionesOrden = explorar?.orden?.opciones;

  const textoBreadcrumb = faltantes.migas;

  const textoVerResultados = interpolar(filtrosTexto?.botones?.verResultados, {
    cantidad: totalEventos,
  });

  return (
    <LayoutPublico
      titulo={explorar?.seo?.titulo}
      descripcion={explorar?.seo?.descripcion}
    >
      <div className="pagina-explorar">
        <div className="ancho-explorar">
          <nav className="migas-explorar" aria-label={textoBreadcrumb}>
            <Link to="/">{textos?.navbar?.enlaces?.inicio}</Link>

            <Icono nombre="chevR" tamano={14} />

            <span aria-current="page">{textos?.navbar?.enlaces?.explorar}</span>
          </nav>

          <header className="encabezado-explorar">
            <h1>{tituloPagina}</h1>

            <div className="buscador-filtros-explorar">
              <form
                className="busqueda-explorar"
                role="search"
                onSubmit={buscarPorTexto}
              >
                <Icono nombre="search" />

                <input
                  type="search"
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                  placeholder={
                    textos?.paginas?.inicio?.hero?.buscador?.placeholders?.movil
                  }
                  aria-label={textos?.navbar?.buscador?.aria}
                />
              </form>

              <button
                ref={botonFiltrosRef}
                type="button"
                className="boton-filtros-movil"
                aria-label={tituloFiltros}
                aria-expanded={panelAbierto}
                aria-controls="panel-filtros-explorar"
                onClick={() => setFiltrosMovilesAbiertos(true)}
              >
                <Icono nombre="sliders" tamano={18} />
              </button>
            </div>

            {/* Con error no se muestra un conteo (sería «0 eventos») */}
            <p role="status">
              {respuestaEventos.cargando
                ? textoCargando
                : !respuestaEventos.error && resultadosTexto}
            </p>
          </header>

          <div className="contenido-explorar">
            <aside
              id="panel-filtros-explorar"
              className={`panel-filtros ${panelAbierto ? "filtros-abiertos" : ""}`}
              aria-label={tituloFiltros}
              role={panelAbierto ? "dialog" : undefined}
              aria-modal={panelAbierto ? "true" : undefined}
            >
              <div className="encabezado-filtros">
                <h2>{tituloFiltros}</h2>

                <div className="acciones-filtros">
                  <button
                    type="button"
                    className="limpiar-filtros"
                    onClick={limpiarFiltros}
                  >
                    {textoLimpiar}
                  </button>

                  <button
                    ref={cerrarPanelRef}
                    type="button"
                    className="cerrar-filtros"
                    aria-label={general?.aria?.cerrarDialogo}
                    onClick={() => setFiltrosMovilesAbiertos(false)}
                  >
                    <Icono nombre="x" tamano={16} />
                  </button>
                </div>
              </div>

              <div className="opciones-filtros">
                <section className="grupo-filtro">
                  <h3>{tituloCategoria}</h3>

                  {categorias.map((categoria) => {
                    const seleccionada = categoriasSeleccionadas.includes(
                      categoria.id,
                    );

                    const nombreCategoria =
                      categoriasTexto?.[categoria.id] ?? categoria.nombre;

                    return (
                      <label className="opcion-categoria" key={categoria.id}>
                        <input
                          type="checkbox"
                          checked={seleccionada}
                          onChange={() => seleccionarCategoria(categoria.id)}
                        />

                        <span>{nombreCategoria}</span>

                        <small>{categoria.eventos ?? "—"}</small>
                      </label>
                    );
                  })}

                  {errorCategorias && (
                    <button
                      type="button"
                      className="reintentar-filtro"
                      onClick={recargarCategorias}
                    >
                      {textoReintentar}
                    </button>
                  )}

                  {cargandoCategorias && <small>{textoCargando}</small>}
                </section>

                <section className="grupo-filtro filtro-fechas">
                  <h3>{fechasTexto?.titulo}</h3>

                  <div className="opciones-fecha">
                    <button
                      type="button"
                      className={estadoFecha === "hoy" ? "seleccionado" : ""}
                      onClick={() => seleccionarFecha("hoy")}
                    >
                      {fechasTexto?.hoy}
                    </button>

                    <button
                      type="button"
                      className={
                        estadoFecha === "finDeSemana" ? "seleccionado" : ""
                      }
                      onClick={() => seleccionarFecha("fin-de-semana")}
                    >
                      {fechasTexto?.finDeSemana}
                    </button>

                    <button
                      type="button"
                      className={estadoFecha === "mes" ? "seleccionado" : ""}
                      onClick={() => seleccionarFecha("mes")}
                    >
                      {fechasTexto?.mes}
                    </button>

                    <button
                      type="button"
                      className={
                        fechasPersonalizadasAbiertas ||
                        estadoFecha === "personalizada"
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
                          estadoFecha === "hoy" ||
                          estadoFecha === "finDeSemana" ||
                          estadoFecha === "mes"
                        ) {
                          actualizarParametros({
                            desde: "",
                            hasta: "",
                          });
                        }
                      }}
                    >
                      {fechasTexto?.elegir}
                    </button>
                  </div>

                  {fechasPersonalizadasAbiertas && (
                    <div className="fechas-personalizadas">
                      <label>
                        <span>{textoDesde}</span>

                        <input
                          type="date"
                          value={desde}
                          onChange={(evento) =>
                            actualizarParametros({
                              desde: evento.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        <span>{textoHasta}</span>

                        <input
                          type="date"
                          min={desde || undefined}
                          value={hasta}
                          onChange={(evento) =>
                            actualizarParametros({
                              hasta: evento.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                  )}
                </section>

                <section className="grupo-filtro">
                  <h3>{tituloCiudad}</h3>

                  <div className="selector-filtro">
                    <select
                      value={ciudad}
                      onChange={(evento) =>
                        actualizarParametros({
                          ciudad: evento.target.value,
                        })
                      }
                      aria-label={tituloCiudad}
                    >
                      <option value="">{textoTodasCiudades}</option>

                      {ciudadesApi.map((item) => (
                        <option key={item.nombre} value={item.nombre}>
                          {item.nombre}
                        </option>
                      ))}
                    </select>

                    <Icono nombre="chevD" tamano={16} />
                  </div>

                  {errorCiudades && (
                    <button
                      type="button"
                      className="reintentar-filtro"
                      onClick={recargarCiudades}
                    >
                      {textoReintentar}
                    </button>
                  )}

                  {cargandoCiudades && <small>{textoCargando}</small>}
                </section>

                <section className="grupo-filtro filtro-precio">
                  <h3>{tituloPrecio}</h3>

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
                      max={escalaPrecio}
                      step={PRECIO_PASO}
                      disabled={!precioTope}
                      value={precioMinimo}
                      aria-label={faltantes.precioMinimo}
                      aria-valuetext={formatoPrecio(precioMinimo)}
                      onChange={(evento) =>
                        cambiarPrecioMinimo(evento.target.value)
                      }
                    />

                    <input
                      className="rango-precio rango-precio-maximo"
                      type="range"
                      min="0"
                      max={escalaPrecio}
                      step={PRECIO_PASO}
                      disabled={!precioTope}
                      value={precioMaximo}
                      aria-label={faltantes.precioMaximo}
                      aria-valuetext={formatoPrecio(precioMaximo)}
                      onChange={(evento) =>
                        cambiarPrecioMaximo(evento.target.value)
                      }
                    />
                  </div>

                  {/* Los valores se muestran cuando llega el precio más alto */}
                  {precioTope && (
                    <div className="etiquetas-precio">
                      <span>{formatoPrecio(precioMinimo)}</span>
                      <span>{formatoPrecio(precioMaximo)}</span>
                    </div>
                  )}
                </section>
              </div>

              <div className="pie-filtros">
                <Boton
                  variante="primario"
                  tamano="g"
                  onClick={() => setFiltrosMovilesAbiertos(false)}
                >
                  {textoVerResultados}
                </Boton>
              </div>
            </aside>

            <section className="resultados-explorar">
              <div className="barra-resultados">
                {(categoriasSeleccionadas.length > 0 ||
                  etiquetaFecha ||
                  ciudad ||
                  consulta) && (
                  <div className="filtros-activos">
                    {categoriasSeleccionadas.map((id) => {
                      const categoria = categorias.find(
                        (item) => String(item.id) === String(id),
                      );

                      const nombre =
                        categoriasTexto?.[id] ?? categoria?.nombre ?? id;

                      return (
                        <button
                          type="button"
                          key={id}
                          onClick={() => seleccionarCategoria(id)}
                          aria-label={`${faltantes.quitarFiltro}: ${nombre}`}
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

                          actualizarParametros({
                            desde: "",
                            hasta: "",
                          });
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

                <span className="conteo-resultados-movil">
                  {respuestaEventos.cargando
                    ? textoCargando
                    : !respuestaEventos.error && resultadosCorto}
                </span>

                <label className="orden-resultados">
                  <span>{etiquetaOrden}</span>

                  <select
                    value={orden}
                    onChange={(evento) =>
                      actualizarParametros({
                        orden: evento.target.value,
                      })
                    }
                  >
                    <option value="fecha">{opcionesOrden?.fecha}</option>

                    <option value="precio">{opcionesOrden?.precio}</option>

                    <option value="popularidad">
                      {opcionesOrden?.popularidad}
                    </option>
                  </select>

                  <Icono nombre="chevD" tamano={16} />
                </label>
              </div>

              {respuestaEventos.error ? (
                <EstadoError
                  error={respuestaEventos.error}
                  onReintentar={() => setIntento((valor) => valor + 1)}
                />
              ) : respuestaEventos.cargando ? (
                <EstadoCarga textos={textos} tarjetas={6} />
              ) : eventos.length > 0 ? (
                <div className="eventos-explorar-grid">
                  {eventos.map((evento) => (
                    <TarjetaEvento key={evento.id} evento={evento} />
                  ))}
                </div>
              ) : (
                <EstadoVacio
                  titulo={tituloVacio}
                  texto={descripcionVacio}
                  accion={
                    <Boton variante="primario" onClick={limpiarFiltros}>
                      {botonLimpiarVacio}
                    </Boton>
                  }
                />
              )}

              {!respuestaEventos.cargando &&
                !respuestaEventos.error &&
                totalPaginas > 1 && (
                  <nav
                    className="paginacion-explorar"
                    aria-label={textos?.componentes?.paginacion?.aria?.etiqueta}
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
                      aria-label={explorar?.paginacion?.anterior}
                    >
                      <Icono nombre="chevL" tamano={16} />
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
                          {indice > 0 && numero - lista[indice - 1] > 1 && (
                            <span className="separador-paginacion">…</span>
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
                      aria-label={explorar?.paginacion?.siguiente}
                    >
                      <Icono nombre="chevR" tamano={16} />
                    </button>
                  </nav>
                )}
            </section>
          </div>
        </div>
      </div>
    </LayoutPublico>
  );
}
