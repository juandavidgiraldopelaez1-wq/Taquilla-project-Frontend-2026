import "./AficheEvento.css";
export default function AficheEvento({ variante = 0, className = "" }) {
  return (
    <div
      className={`arte-evento arte-evento-${variante} ${className}`}
      aria-hidden="true"
    />
  );
}
