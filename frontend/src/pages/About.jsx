"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import emailjs from 'emailjs-com'; 
import {
  Train,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Moon,
  Sun,
  Info,
  Users,
  History,
  Target,
  CheckCircle,
} from "lucide-react";

export default function AboutContact() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [formStatus, setFormStatus] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("sending");

    emailjs
      .sendForm(
        "service_rtlykqm",
        "template_bhsneit",
        formRef.current,
        "QNM8y_Yus59xXBYos"
      )
      .then(() => {
        setFormStatus("success");
        e.target.reset();
        setTimeout(() => setFormStatus(null), 3000);
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        setFormStatus("error");
      });
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
     <header className={`w-full py-4 px-6 ${darkMode ? "bg-gray-800" : "bg-[#0a3172]"} text-white shadow-md`}>
  <div className="max-w-6xl mx-auto flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <Train className="w-6 h-6" />
      <h1 className="text-xl font-bold">SNTF</h1>
    </div>
    <div className="text-sm opacity-90">Système de Détection des Défauts de Rails</div>
    <Button
      variant={darkMode ? "outline" : "ghost"}
      onClick={toggleTheme}
      className="flex items-center gap-2"
      aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
    >
      {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  </div>
</header>

      <main className="max-w-5xl mx-auto py-10 px-6">
    <div className="flex items-center gap-3 mb-6">
  <div className="bg-blue-100 p-2 rounded-full shadow">
    <Info className="w-6 h-6 text-blue-700" />
  </div>
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">À propos du système</h2>
</div>


        <div className="mb-6 border-b border-gray-300 dark:border-gray-700 flex gap-6">
          <button onClick={() => setActiveTab("about")} className={`${activeTab === "about" ? "font-bold border-b-2 border-blue-600" : "hover:text-blue-500"}`}>À propos</button>
          <button onClick={() => setActiveTab("contact")} className={`${activeTab === "contact" ? "font-bold border-b-2 border-blue-600" : "hover:text-blue-500"}`}>Contact</button>
        </div>

        {activeTab === "about" ? (
          <section className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-blue-100 dark:border-gray-700">
            <p className="text-lg">
              Ce système vise à améliorer la sécurité ferroviaire grâce à une surveillance intelligente des rails.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                <Target className="text-blue-700 dark:text-blue-300 mb-2" />
                <h4 className="font-semibold">Technologies</h4>
                <p className="text-sm">Capteurs, vision, IA pour anticiper les défauts.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                <Users className="text-blue-700 dark:text-blue-300 mb-2" />
                <h4 className="font-semibold">Équipe</h4>
                <p className="text-sm">Ingénieurs spécialisés en maintenance ferroviaire.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                <CheckCircle className="text-green-700 dark:text-green-300 mb-2" />
                <h4 className="font-semibold">Sécurité</h4>
                <p className="text-sm">Réduction significative des incidents sur voie.</p>
              </div>
            </div>
          </section>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input name="name" required placeholder="Nom complet" />
              <Input name="email" required type="email" placeholder="Adresse email" />
            </div>
            <Input name="subject" required placeholder="Sujet" />
            <Textarea name="message" required placeholder="Message..." rows={4} />
            <Button type="submit" className="bg-blue-700 text-white">
              {formStatus === "sending" ? "Envoi..." : formStatus === "success" ? "Envoyé ✅" : "Envoyer"}
            </Button>
            {formStatus === "error" && <p className="text-red-500">Erreur lors de l'envoi du message.</p>}
          </form>
        )}
      </main>
      {/* Pied de page */}
        <footer className={`mt-8 pt-4 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <p>© SNTF - Système de Détection des Défauts de Rails</p>
        </footer>
    </div>
  );
}