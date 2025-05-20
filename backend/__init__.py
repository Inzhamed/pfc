# backend/app/login/__init__.py

from dotenv import load_dotenv
import os
from pymongo import MongoClient

# Charge les variables d'environnement depuis le fichier .env
load_dotenv(dotenv_path="C:/Users/hp/Documents/pfc/backend/.env")

# Récupère les variables d'environnement
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")

if not MONGO_URI or not MONGO_DB:
    raise ValueError("MONGO_URI ou MONGO_DB n'est pas défini dans le fichier .env")

# Initialise le client MongoDB
client = MongoClient(MONGO_URI)

# Sélectionne la base de données
db = client[MONGO_DB]

# Ici tu peux aussi importer ou définir les autres éléments nécessaires
