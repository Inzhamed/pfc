import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import AdminPage from './pages/AdminPage';
import Reports from "./pages/Reports";
import About from "./pages/About";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"; // attention à la majuscule
import Layout from "./components/Layout";
import Settings from "./pages/Settings";
=======
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
>>>>>>> origin/backend-malek

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
<<<<<<< HEAD
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
=======
        <Route path="/dashboard" element={<Dashboard />} />
>>>>>>> origin/backend-malek
      </Routes>
    </Router>
  );
}

export default App;
