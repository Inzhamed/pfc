import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from './pages/AdminPage';
import Reports from "./pages/Reports";
import About from "./pages/About";
import History from "./pages/History";
import Login from "./pages/Login"; 
import Layout from "./components/Layout";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
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
     <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
