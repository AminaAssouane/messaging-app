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
import Layout from "./components/Layout/Layout.jsx";
import FriendsList from "./components/FriendsList/FriendsList.jsx";
import FriendRequests from "./components/FriendRequests/FriendRequests.jsx";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/chat", element: <Chat /> },
      {
        path: "/friends",
        element: <FriendsPage />,
        children: [
          { index: true, element: <FriendsList /> },
          { path: "requests", element: <FriendRequests /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App router={router} />
  </StrictMode>,
);
