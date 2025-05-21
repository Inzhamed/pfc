from pymongo import MongoClient
from pymongo.collection import Collection
from models import Report
import os
from dotenv import load_dotenv
from typing import List


# Charger les variables d'environnement
load_dotenv()

# Récupérer l'URL de connexion MongoDB depuis les variables d'environnement
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Créer une connexion à MongoDB
client = MongoClient(MONGO_URI)

# Sélectionner la base de données
MONGO_DB = os.getenv("MONGO_DB", "railvision_db")
db = client[MONGO_DB]


# Sélectionner la collection pour les rapports
reports_collection: Collection = db.reports

# Fonction pour convertir un document MongoDB en modèle Report
def report_from_mongo(report_doc) -> Report:
    # Supprimer l'ID MongoDB avant de convertir en modèle Pydantic
    if "_id" in report_doc:
        del report_doc["_id"]
    return Report(**report_doc)

# Fonction pour récupérer tous les rapports
async def get_all_reports() -> List[Report]:
    reports = []
    for report_doc in reports_collection.find():
        reports.append(report_from_mongo(report_doc))
    return reports

# Fonction pour récupérer un rapport par son ID
async def get_report_by_id(report_id: str) -> Report:
    report_doc = reports_collection.find_one({"id": report_id})
    if report_doc:
        return report_from_mongo(report_doc)
    return None

# Fonction pour créer un nouveau rapport
async def create_report(report: Report) -> Report:
    report_dict = report.dict()
    reports_collection.insert_one(report_dict)
    return report

# Fonction pour mettre à jour un rapport existant
async def update_report(report_id: str, report: Report) -> Report:
    report_dict = report.dict()
    reports_collection.update_one({"id": report_id}, {"$set": report_dict})
    return report

# Fonction pour supprimer un rapport
async def delete_report(report_id: str) -> bool:
    result = reports_collection.delete_one({"id": report_id})
    return result.deleted_count > 0
