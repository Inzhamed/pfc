from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")

if not MONGO_URI or not MONGO_DB:
    raise ValueError("⚠️ MONGO_URI ou MONGO_DB non défini dans le .env")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
technicien_collection = db["techniciens"]
