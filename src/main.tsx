import * as React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tailwind.css";
import App from "./App";
import { initWebVitals } from "./utils/reportWebVitals";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize Web Vitals monitoring after render
if (typeof window !== 'undefined') {
  initWebVitals();
}