import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import "./index.css";
import App from "./App.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import Chat from "./pages/Chat/Chat.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import FriendsPage from "./pages/FriendsPage/FriendsPage.jsx";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  { path: "/friends", element: <FriendsPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App router={router} />
  </StrictMode>,
);
