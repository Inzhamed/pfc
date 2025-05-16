import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Reports from "./pages/Reports";
import About from "./pages/About"
import History from "./pages/History"
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<div>Accueil</div>} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/about" element={<About />} />
        <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
