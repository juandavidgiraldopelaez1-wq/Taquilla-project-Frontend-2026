import { createContext } from "react";

// Contexto compartido de idioma, textos, consentimiento y accesibilidad.
// Vive en su propio archivo para que el Provider y el hook puedan importarlo
// sin que el archivo del Provider exporte algo distinto a componentes.
export const PreferenciasContext = createContext(null);
