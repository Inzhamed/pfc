import os
from dotenv import load_dotenv

# Charge les variables du fichier .env
load_dotenv()

# Chaîne de connexion MongoDB
MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    raise ValueError("La variable MONGODB_URL est manquante dans le fichier .env")
