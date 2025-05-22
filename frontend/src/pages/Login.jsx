import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import axios from 'axios';
import { Moon, Sun } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/techniciens/login", {
        email,
        password
      });

      console.log("Réponse backend :", response.data);

      // ✅ Sauvegarde du token et du rôle admin
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("isAdmin", response.data.is_admin); // "true" ou "false"

      // ✅ Redirection après connexion
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur de connexion :", error);

      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Email ou mot de passe incorrect.");
        } else {
          setErrorMessage("Erreur serveur. Veuillez réessayer.");
        }
      } else {
        setErrorMessage("Impossible de se connecter au serveur.");
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.remove(isDark ? 'dark' : 'light');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
    setTheme(newTheme);
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      {/* Bouton de changement de thème */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-full ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition`}
        aria-label="Changer de thème"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Colonne gauche */}
      <div className={`w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center ${isDark ? "bg-gray-800" : "bg-blue-50"}`}>
        <h1 className="text-4xl font-bold mb-6 md:mb-10 text-center md:text-left">Rail Defect App</h1>
        <p className={`text-2xl md:text-3xl font-semibold leading-snug mb-4 md:mb-6 text-center md:text-left ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          Précision. Sécurité. Innovation.
        </p>
        <p className={`text-base md:text-lg text-center md:text-left ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Grâce à l'intelligence artificielle, notre système détecte automatiquement les défauts des rails
          avec une précision inégalée, améliorant la sécurité ferroviaire tout en réduisant les coûts d'inspection.
        </p>
      </div>

      {/* Colonne droite */}
      <div className={`w-full md:w-1/2 flex items-center justify-center p-8 ${isDark ? "bg-gray-900" : "bg-white"}`}>
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-sm p-6 rounded-lg shadow-md ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border`}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

          {errorMessage && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-100 p-2 rounded">
              {errorMessage}
            </div>
          )}

          <label className={`block mb-1 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Email
          </label>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md mb-4 ${isDark ? "bg-gray-700 border-gray-600 focus:border-blue-500" : "bg-white border-gray-300 focus:border-blue-500"} focus:ring-1 focus:ring-blue-500 focus:outline-none transition`}
            required
          />

          <label className={`block mb-1 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md mb-4 ${isDark ? "bg-gray-700 border-gray-600 focus:border-blue-500" : "bg-white border-gray-300 focus:border-blue-500"} focus:ring-1 focus:ring-blue-500 focus:outline-none transition`}
            required
          />

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className={`rounded ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} focus:ring-blue-500`}
              />
              <label htmlFor="remember" className={`ml-2 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Se souvenir de moi
              </label>
            </div>
            <a href="#" className={`text-sm ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}>
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-md transition ${isDark ? "bg-blue-700 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"} text-white font-medium`}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
