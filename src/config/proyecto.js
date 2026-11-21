// Configuración leída de las variables de entorno (.env). Ver .env.example.
export const proyecto = {
  // Dirección base de la API, por ejemplo https://…/api/v1
  api: import.meta.env.VITE_API_URL,
  // Opcionales, solo para pruebas de estados (US-TAQ-S2-02).
  simularLatencia: import.meta.env.VITE_SIMULAR_LATENCIA,
  simularError: import.meta.env.VITE_SIMULAR_ERROR,
};
