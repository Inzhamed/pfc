import React, { useState, useEffect } from 'react';
import LoginForm from '../components/ui/LoginForm';

const LoginPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Appliquer le thème au <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex transition duration-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Colonne gauche */}
      <div className="w-1/2 p-16 flex flex-col justify-center bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-700">
        <h1 className="text-4xl font-bold mb-10 dark:text-white">RailVision</h1>
        <p className="text-3xl font-semibold leading-snug mb-6 text-gray-800 dark:text-gray-200">
          Précision. Sécurité. Innovation.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Grâce à l'intelligence artificielle, notre système détecte automatiquement les défauts des rails
          avec une précision inégalée, améliorant la sécurité ferroviaire tout en réduisant les coûts d'inspection.
        </p>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-10 self-start bg-gray-200 dark:bg-gray-600 text-sm px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition"
        >
          {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
        </button>
      </div>

      {/* Colonne droite */}
      <div className="w-1/2 flex items-center justify-center bg-white dark:bg-gray-900">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;