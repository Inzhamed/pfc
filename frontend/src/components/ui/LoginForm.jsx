import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../lib/firebase'; // ajuste le chemin si besoin
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // <-- hook pour la redirection

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
    // Ici tu peux gérer la connexion classique et rediriger si tu veux
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ Connecté avec Google :", user);
      // Redirection après login réussi
      navigate('/dashboard');  // change la route selon ton projet
    } catch (error) {
      console.error("❌ Erreur Google Auth:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md px-8 py-10 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Connexion</h2>

      {/* Email */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      {/* Password */}
      <div className="mb-4 flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe</label>
        <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Mot de passe oublié ?</a>
      </div>
      <input
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        required
      />

      {/* Se souvenir */}
      <div className="mb-4 flex items-center">
        <input type="checkbox" id="remember" className="mr-2" />
        <label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">Se souvenir de moi</label>
      </div>

      {/* Bouton Submit */}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Se connecter
      </button>

      {/* Lien inscription */}
      <div className="text-center my-4 text-sm text-gray-600 dark:text-gray-400">
        Vous n'avez pas de compte ? <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Inscription</a>
      </div>

      {/* Bouton Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Se connecter avec Google
      </button>
    </form>
  );
};

export default LoginForm;
