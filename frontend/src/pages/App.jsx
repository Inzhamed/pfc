import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}
export default App;
