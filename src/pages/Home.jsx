import { useState } from "react";
import { useNavigate } from "react-router";

import LayoutPublico from "../components/LayoutPublico/LayoutPublico.jsx";
import HeroTaquilla from "../components/HeroTaquilla/HeroTaquilla.jsx";
import BuscadorEventos from "../components/BuscadorEventos/BuscadorEventos.jsx";
import CategoriasEventos from "../components/CategoriasEventos/CategoriasEventos.jsx";
import SeccionEventos from "../components/SeccionEventos/SeccionEventos.jsx";
import EstadoError from "../components/EstadoError/EstadoError.jsx";
import { usePreferencias } from "../hooks/usePreferencias.js";
import { useEsMovil } from "../hooks/useEsMovil.js";
import { useRecurso } from "../hooks/useRecurso.js";
import { interpolar } from "../utils/formato.js";
import { rangoFecha, rutaExplorar } from "../utils/filtros.js";

// Cantidad de tarjetas por sección en el Inicio (diseño de Figma: 4 columnas).
const EVENTOS_POR_SECCION = 4;

/**
 * Vista 1 · Inicio público.
 * Datos: GET /eventos/destacados, GET /categorias, GET /ciudades y
 * GET /eventos?ciudad=… para «Próximamente en {ciudad}».
 */
export default function Home() {
  const { textos } = usePreferencias();
  const navigate = useNavigate();
  const inicio = textos?.paginas?.inicio;

  const destacados = useRecurso("/eventos/destacados");
  const categorias = useRecurso("/categorias");
  const ciudades = useRecurso("/ciudades");

  const listaCiudades = ciudades.datos?.datos ?? [];
  const [ciudadElegida, setCiudadElegida] = useState(null);
  // Por defecto, la ciudad con más eventos (la API las entrega ordenadas).
  const ciudad = ciudadElegida ?? listaCiudades[0]?.nombre ?? "";

  // En celular la segunda sección es «Este fin de semana» (Figma móvil):
  // los eventos de la ciudad entre el sábado y el domingo.
  const esMovil = useEsMovil();
  const finDeSemana = esMovil ? rangoFecha("finDeSemana") : {};
  const filtrosProximos = { ciudad, ...finDeSemana };

  const proximos = useRecurso(
    ciudad
      ? `/eventos?${new URLSearchParams({
        ...filtrosProximos,
        orden: "fecha",
        porPagina: String(EVENTOS_POR_SECCION),
      })}`
      : null,
  );

  const listaDestacados = destacados.datos?.datos ?? [];

  function buscar(filtros) {
    navigate(rutaExplorar(filtros));
  }

  return (
    <LayoutPublico
      titulo={inicio?.seo?.titulo}
      descripcion={inicio?.seo?.descripcion}
    >
      <HeroTaquilla
        textos={textos}
        destacado={listaDestacados[0] ?? null}
        categorias={categorias.datos?.datos ?? []}
      >
        <BuscadorEventos
          textos={textos}
          ciudades={listaCiudades}
          ciudad={ciudad}
          onCambiarCiudad={setCiudadElegida}
          onBuscar={buscar}
        />
      </HeroTaquilla>

      <div className="ancho-home">
        {categorias.error ? (
          <EstadoError
            error={categorias.error}
            onReintentar={categorias.recargar}
          />
        ) : (
          <CategoriasEventos
            categorias={categorias.datos?.datos ?? []}
            cargando={categorias.cargando}
            textos={textos}
          />
        )}

        <SeccionEventos
          id="destacados"
          titulo={inicio?.destacados?.titulo}
          tituloMovil={inicio?.filtrosMovil?.destacados}
          descripcion={inicio?.destacados?.subtitulo}
          verTodos={{
            to: "/explorar",
            texto: inicio?.destacados?.enlaces?.verTodos,
          }}
          eventos={listaDestacados.slice(0, EVENTOS_POR_SECCION)}
          estado={destacados}
          textos={textos}
        />

        <SeccionEventos
          id="proximos"
          titulo={interpolar(inicio?.proximos?.titulo, { ciudad })}
          tituloMovil={inicio?.filtrosMovil?.finDeSemana}
          descripcion={inicio?.proximos?.subtitulo}
          verTodos={{
            to: rutaExplorar(filtrosProximos),
            texto: inicio?.destacados?.enlaces?.verTodos,
          }}
          eventos={proximos.datos?.datos ?? []}
          estado={ciudad ? proximos : ciudades}
          textos={textos}
        />
      </div>
    </LayoutPublico>
  );
}