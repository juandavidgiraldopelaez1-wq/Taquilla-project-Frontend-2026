import { useContext } from "react";
import { PreferenciasContext } from "../context/preferenciasContexto.js";

export function usePreferencias() {
  const valor = useContext(PreferenciasContext);

  if (!valor) {
    throw new Error("PreferenciasProvider requerido");
  }

  return valor;
}
