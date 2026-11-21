/*
 * Textos de accesibilidad que GET /textos todavía no entrega.
 * Se centralizan aquí (y no dentro de los componentes) para que sea fácil
 * reemplazarlos el día que la API los incluya. Todo el resto de la interfaz
 * sale de la API.
 */
export const textosFaltantes = {
  es: {
    navegacionPrincipal: "Navegación principal",
    categorias: "Categorías de eventos",
    migas: "Ruta de navegación",
    todasLasCiudades: "Todas las ciudades",
    fechaDesde: "Desde",
    fechaHasta: "Hasta",
    precioMinimo: "Precio mínimo",
    precioMaximo: "Precio máximo",
    quitarFiltro: "Quitar filtro",
    funciones: "Funciones",
    localidades: "Localidades",
  },
  en: {
    navegacionPrincipal: "Main navigation",
    categorias: "Event categories",
    migas: "Breadcrumb",
    todasLasCiudades: "All cities",
    fechaDesde: "From",
    fechaHasta: "To",
    precioMinimo: "Minimum price",
    precioMaximo: "Maximum price",
    quitarFiltro: "Remove filter",
    funciones: "Showtimes",
    localidades: "Seating areas",
  },
};
