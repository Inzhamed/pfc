from pymongo import MongoClient
from pymongo.collection import Collection
from models import Report
import os
from dotenv import load_dotenv
from typing import List

# Charger les variables d'environnement
load_dotenv()

# Récupérer l'URL de connexion MongoDB depuis les variables d'environnement
MONGODB_URL = os.getenv("MONGO_URI")
if not MONGODB_URL:
    raise ValueError("La variable d'environnement MONGODB_URL est manquante. Vérifie ton fichier .env")

# Connexion au cluster MongoDB Atlas
client = MongoClient(MONGODB_URL)

# Base de données (choisis le nom que tu veux ici)
db = client["rail_defects_db"]  # ⚠️ Si tu veux changer, modifie ce nom dans ton cluster aussi

# Collection pour les rapports
reports_collection: Collection = db["reports"]

# Fonction pour convertir un document MongoDB en modèle Report
def report_from_mongo(report_doc) -> Report:
    if "_id" in report_doc:
        del report_doc["_id"]
    return Report(**report_doc)

# CRUD
async def get_all_reports() -> List[Report]:
    reports = []
    for report_doc in reports_collection.find():
        reports.append(report_from_mongo(report_doc))
    return reports

async def get_report_by_id(report_id: str) -> Report:
    report_doc = reports_collection.find_one({"id": report_id})
    if report_doc:
        return report_from_mongo(report_doc)
    return None

async def create_report(report: Report) -> Report:
    report_dict = report.dict()
    reports_collection.insert_one(report_dict)
    return report

async def update_report(report_id: str, report: Report) -> Report:
    report_dict = report.dict()
    reports_collection.update_one({"id": report_id}, {"$set": report_dict})
    return report

async def delete_report(report_id: str) -> bool:
    result = reports_collection.delete_one({"id": report_id})
    return result.deleted_count > 0
