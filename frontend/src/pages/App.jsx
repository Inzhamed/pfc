import '@/App.css';
import '@/index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "@/pages/Dashboard";
import LoginPage from "@/pages/Login";
import Reports from "@/pages/Reports";
import About from "@/pages/About";
import History from "@/pages/History"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Accueil</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/history" element={<History />} />
       <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
