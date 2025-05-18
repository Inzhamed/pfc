from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os

MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Client synchrone pour les opérations qui nécessitent une connexion immédiate
client = MongoClient(MONGO_DETAILS)
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except ConnectionFailure as e:
    print("Could not connect to MongoDB:", e)

# Client asynchrone pour FastAPI
async_client = AsyncIOMotorClient(MONGO_DETAILS)

database = async_client.sntf_reports
reports_collection = database.get_collection("reports")