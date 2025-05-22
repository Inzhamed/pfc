import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from './pages/AdminPage';
import Reports from "./pages/Reports";
import About from "./pages/About";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"; // attention à la majuscule
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Page sans Layout (ex : login) */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* Pages avec Layout */}
        <Route
          path="/dashboard"
          element={
            <Dashboard />
        
          }
        />
        <Route
          path="/reports"
          element={
            <Layout>
              <Reports />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/history"
          element={
            <Layout>
              <History />
            </Layout>
          }
        />
    
      </Routes>
    </Router>
  );
}

export default App;
