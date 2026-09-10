import { StrictMode } from "react"; //Это специальный компонент React, который помогает находить потенциальные проблемы во время разработки.
import { createRoot } from "react-dom/client"; //Она нужна, чтобы запустить React внутри HTML-элемента.
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
