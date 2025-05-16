// Fichier centralisé pour toutes les constantes partagées
export const DEFECT_TYPES = [
  { 
    id: "joint", 
    label: "Joint", 
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
  },
  { 
    id: "squat", 
    label: "Squat", 
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" 
  },
  { 
    id: "ssquat", 
    label: "SSquat", 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" 
  }
];

export const RAIL_LINES = [
  { id: "ALGER-ORAN", label: "Ligne Alger-Oran" },
  { id: "ALGER-CONSTANTINE", label: "Ligne Alger-Constantine" },
  { id: "ORAN-BEJAIA", label: "Ligne Oran-Béjaïa" }
];

export const ACTIONS = [
  { 
    id: "repaired", 
    label: "Réparé", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
  },
  { 
    id: "postponed", 
    label: "Reporté", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
  },
  { 
    id: "unrepairable", 
    label: "Non réparable", 
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" 
  }
];

// Configuration pour les badges
export const STATUS_CONFIG = {
  repaired: { 
    label: "Réparé", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
  },
  postponed: { 
    label: "Reporté", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
  },
  unrepairable: { 
    label: "Non réparable", 
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" 
  }
};

// Pour la cohérence avec l'historique
export const DEFAULT_REPORT = {
  technician: {
    name: "",
    id: "",
    function: ""
  },
  date: new Date().toISOString().split('T')[0],
  location: {
    line: "",
    pk: "",
    description: ""
  },
  defect: {
    type: "",
    description: "",
    image: null
  },
  action: ""
};