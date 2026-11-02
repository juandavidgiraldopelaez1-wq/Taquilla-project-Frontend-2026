import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./pages/Home.jsx";
import Explorar from "./pages/Explorar.jsx";
import { PreferenciasProvider } from "./context/PreferenciasContext.jsx";

import "./styles/tokens.css";
import "./styles/base.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PreferenciasProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explorar />} />
        </Routes>
      </BrowserRouter>
    </PreferenciasProvider>
  </StrictMode>,
);