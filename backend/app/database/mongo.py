from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Récupérer l'URL depuis le fichier .env
MONGODB_URL = os.getenv("MONGODB_URL")

# Initialiser le client MongoDB
client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi('1'))

# Sélectionner la base de données
db = client["pfc-rail"]  # Tu peux changer le nom si tu veux
defauts_collection = db["defauts"]  # Nom de la collection pour les défauts
