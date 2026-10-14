import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CompanionProvider } from "./Companion";
import "./styles.css";
import "./pink-world.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CompanionProvider>
      <App />
    </CompanionProvider>
  </React.StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
      })
      .catch(() => {
        // The whole website also works without service-worker support.
      });
  });
}
