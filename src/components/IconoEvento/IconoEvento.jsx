import "./IconoEvento.css";
export default function IconoEvento({ tipo }) {
  const trazos = {
    buscar: "M15 15l6 6M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14",
    lugar:
      "M12 22S4 14 4 9a8 8 0 1 1 16 0c0 5-8 13-8 13ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
    fecha: "M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2ZM3 10h18M7 2v6m10-6v6",
    Conciertos:
      "M9 18V5l11-2v13M9 8l11-2M9 18c0 4-7 4-7 0s7-4 7 0Zm11-2c0 4-7 4-7 0s7-4 7 0Z",
    Teatro: "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
    Deportes:
      "M7 3h10v7a5 5 0 0 1-10 0V3ZM7 5H3v4a4 4 0 0 0 5 4m9-8h4v4a4 4 0 0 1-5 4m-4 2v5m-5 1h10",
    Festivales: "M5 22V3c5-4 9 4 14 0v10c-5 4-9-4-14 0",
    Comedia:
      "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8 9h.1m7.9 0h.1M7 14c3 5 7 5 10 0",
    Familiares:
      "M9 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM2 21v-4a7 7 0 0 1 14 0v4m1-18a3 3 0 0 1 0 6m2 5a5 5 0 0 1 3 5v2",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={trazos[tipo] || trazos.fecha} />
    </svg>
  );
}
