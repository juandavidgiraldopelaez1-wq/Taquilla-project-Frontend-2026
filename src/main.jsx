import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import Home from "./pages/Home.jsx";
import Explorar from "./pages/Explorar.jsx";
import DetalleEvento from "./pages/DetalleEvento.jsx";
import Ingresar from "./pages/Ingresar.jsx";
import NoEncontrado from "./pages/NoEncontrado.jsx";
import { PreferenciasProvider } from "./context/PreferenciasContext.jsx";
import { SesionProvider } from "./context/SesionContext.jsx";

import "./styles/tokens.css";
import "./styles/base.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PreferenciasProvider>
      <BrowserRouter>
        <SesionProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/eventos/:slug" element={<DetalleEvento />} />
            <Route path="/ingresar" element={<Ingresar />} />
            <Route path="*" element={<NoEncontrado />} />
          </Routes>
        </SesionProvider>
      </BrowserRouter>
    </PreferenciasProvider>
  </StrictMode>,
);
