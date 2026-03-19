import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./seller/Index.css"; // Import seller dashboard styles
import App from "./App.jsx";
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
