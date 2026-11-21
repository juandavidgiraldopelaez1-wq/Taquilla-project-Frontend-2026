import { useContext } from "react";
import { SesionContext } from "../context/sesionContexto.js";

export function useSesion() {
  const valor = useContext(SesionContext);

  if (!valor) {
    throw new Error("SesionProvider requerido");
  }

  return valor;
}
