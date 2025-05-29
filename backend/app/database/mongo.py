from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL

# Initialise le client MongoDB asynchrone
client = AsyncIOMotorClient(MONGODB_URL)

db = client["pfc-rail"]  # Nom de la base de données (tu peux le changer)
defauts_collection = db["defauts"]  # Nom de la collection

# Ce module sera utilisé dans les routes pour accéder à la DB