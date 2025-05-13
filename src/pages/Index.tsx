import { Navigate } from "react-router-dom";

export default function Index() {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";

  // Redirect to dashboard if logged in, otherwise to login page
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
