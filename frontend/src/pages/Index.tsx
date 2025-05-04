
import { Navigate } from "react-router-dom";

export default function Index() {
  // Redirect to dashboard on initial load
  return <Navigate to="/dashboard" replace />;
}
