import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Register } from "./pages/Register/Register.jsx";

const router = createBrowserRouter([
  { path: "/auth/register", element: <Register /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App router={router} />
  </StrictMode>,
);
