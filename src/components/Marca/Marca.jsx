
import "./Marca.css";

export default function Marca({ nombre, tipo }) {
  return (
    <a className="marca-home" href="/" aria-label={`${nombre}, inicio`}>
      <span className={`emblema emblema-${tipo}`} aria-hidden="true">
        {tipo === "sintonia" ? (
          <svg viewBox="0 0 32 32">
            <path
              d="M8 13v7m5-12v17m6-14v11m5-8v5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        ) : tipo === "cromoverso" ? (
          <svg viewBox="0 0 24 24">
            <path
              d="m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 18 18" fill="none">
            <path
              d="M1.5 6.75C2.09674 6.75 2.66903 6.98705 3.09099 7.40901C3.51295 7.83097 3.75 8.40326 3.75 9C3.75 9.59674 3.51295 10.169 3.09099 10.591C2.66903 11.0129 2.09674 11.25 1.5 11.25V12.75C1.5 13.1478 1.65804 13.5294 1.93934 13.8107C2.22064 14.092 2.60218 14.25 3 14.25H15C15.3978 14.25 15.7794 14.092 16.0607 13.8107C16.342 13.5294 16.5 13.1478 16.5 12.75V11.25C15.9033 11.25 15.331 11.0129 14.909 10.591C14.4871 10.169 14.25 9.59674 14.25 9C14.25 8.40326 14.4871 7.83097 14.909 7.40901C15.331 6.98705 15.9033 6.75 16.5 6.75V5.25C16.5 4.85218 16.342 4.47064 16.0607 4.18934C15.7794 3.90804 15.3978 3.75 15 3.75H3C2.60218 3.75 2.22064 3.90804 1.93934 4.18934C1.65804 4.47064 1.5 4.85218 1.5 5.25V6.75Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
            />
            <path
              d="M9.75 3.75V5.25M9.75 12.75V14.25M9.75 8.25V9.75"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
            />
          </svg>
        )}
      </span>
      {nombre}
    </a>
  );
}
