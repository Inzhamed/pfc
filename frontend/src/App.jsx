import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
<<<<<<< Updated upstream
import History from "@/pages/History";  

=======
import History from "@/pages/History";
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
<<<<<<< Updated upstream
        <Route path="/history" element={<History />} />
=======
        <Route path="/History" element={<History />} />
        
      

>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
}

export default App
