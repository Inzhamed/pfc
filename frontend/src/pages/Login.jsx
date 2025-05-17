import React, { useState } from 'react';
import LoginForm from '../components/ui/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';

const LoginPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tentative de connexion:', { email, password });
    navigate('/dashboard');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition duration-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Colonne gauche */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-700">
        <h1 className="text-4xl font-bold mb-6 md:mb-10 dark:text-white text-center md:text-left">
          RailVision
        </h1>
        <p className="text-2xl md:text-3xl font-semibold leading-snug mb-4 md:mb-6 text-gray-800 dark:text-gray-200 text-center md:text-left">
          Précision. Sécurité. Innovation.
        </p>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 text-center md:text-left">
          Grâce à l'intelligence artificielle, notre système détecte automatiquement les défauts des rails
          avec une précision inégalée, améliorant la sécurité ferroviaire tout en réduisant les coûts d'inspection.
        </p>

        <button
          onClick={toggleTheme}
          className="mt-6 md:mt-10 self-center md:self-start bg-gray-200 dark:bg-gray-600 text-sm px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition"
        >
          {theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre'}
        </button>
      </div>

      {/* Colonne droite */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-gray-900 p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-6 rounded shadow dark:bg-gray-800"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"
            required
          />

          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"
            required
          />

          <div className="mb-4 flex items-center">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">
              Se souvenir de moi
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
