import '@/App.css';
import '@/index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "@/pages/Dashboard";
import LoginPage from "@/pages/Login";
import Reports from "@/pages/Reports";
import TestPDF from "@/pages/TestPDF";
import About from "@/pages/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Accueil</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/test" element={<TestPDF />} />
        <Route path="/testpdf" element={<TestPDF />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
