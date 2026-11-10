import { useState } from "react";
import { normalizar } from "../data/catalogo.js";

export function useEventos(eventos) {
  const [filtros, setFiltros] = useState(null);

  const resultados = eventos.filter(
    (evento) =>
      !filtros ||
      ((!filtros.consulta ||
        normalizar(evento.nombre).includes(normalizar(filtros.consulta))) &&
        (!filtros.ciudad || evento.ciudad === filtros.ciudad) &&
        (!filtros.fecha || evento.fecha === filtros.fecha) &&
        (!filtros.categoria || evento.categoria === filtros.categoria)),
  );

  function buscar(valores) {
    setFiltros(valores);

    document
      .getElementById("eventos")
      ?.scrollIntoView({ block: "start" });
  }

  function filtrarCategoria(categoria) {
    const nuevosFiltros = { ...(filtros ?? {}) };

    if (categoria) {
      nuevosFiltros.categoria = categoria;
    } else {
      delete nuevosFiltros.categoria;
    }

    const hayFiltrosActivos = Object.values(nuevosFiltros).some(Boolean);

    buscar(hayFiltrosActivos ? nuevosFiltros : null);
  }

  return {
    filtros,
    resultados,
    buscar,
    setFiltros,
    filtrarCategoria,
  };
}