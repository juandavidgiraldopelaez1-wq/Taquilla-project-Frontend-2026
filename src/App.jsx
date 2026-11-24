import { BrowserRouter, Route, Routes } from "react-router";

import Home from "./pages/Home.jsx";
import Explorar from "./pages/Explorar.jsx";
import DetalleEvento from "./pages/DetalleEvento.jsx";
import Ingresar from "./pages/Ingresar.jsx";
import NoEncontrado from "./pages/NoEncontrado.jsx";
import PantallaCarga from "./components/PantallaCarga/PantallaCarga.jsx";
import { SesionProvider } from "./context/SesionContext.jsx";
import { usePreferencias } from "./hooks/usePreferencias.js";

/**
 * Rutas del sitio. Hasta que lleguen los textos de la interfaz se muestra
 * la pantalla de carga, con sus textos de GET /textos?seccion=estados.
 */
export default function App() {
    const { textosListos } = usePreferencias();

    if (!textosListos) return <PantallaCarga />;

    return (
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
    );
}