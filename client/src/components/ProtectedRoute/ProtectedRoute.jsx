import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function isTokenValid(token) {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!isTokenValid(token)) {
    localStorage.removeItem("token"); // clean up expired token
    return <Navigate to="/login" />;
  }

  return children;
}
