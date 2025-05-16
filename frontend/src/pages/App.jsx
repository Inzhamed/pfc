import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Reports from "@/pages/Reports";
import TestPDF from "@/pages/TestPDF";
import About from "@/pages/About"
import History from "@/pages/History"
import Login from "@/pages/Login"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Accueil</div>} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/test" element={<TestPDF />} />
        <Route path="/testpdf" element={<TestPDF />} /> {/* ← ajoute cette ligne */}
        <Route path="/about" element={<About />} />
        <Route path="/history" element={<History />} />
         <Route path="/login" element={<Login />} />

       
      </Routes>
    </Router>
  );
}

export default App;
