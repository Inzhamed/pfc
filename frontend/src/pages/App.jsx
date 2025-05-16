import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Reports from "@/pages/Reports";
import TestPDF from "@/pages/TestPDF";
import About from "@/pages/About"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Accueil</div>} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/test" element={<TestPDF />} />
        <Route path="/testpdf" element={<TestPDF />} /> {/* ← ajoute cette ligne */}
        <Route path="/about" element={<About />} />
       
      </Routes>
    </Router>
  );
}

export default App;
