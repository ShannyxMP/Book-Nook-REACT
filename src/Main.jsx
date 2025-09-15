import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./styles/main-collageTheme.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* NOTE: does not render any visible UI but identifies and highlights potential issues and deviations from best practices */}
    <Header />
    <App />
    {/* TODO: ?to create conditionals to configure which page is rendered */}
    <Footer />
  </StrictMode>
);
