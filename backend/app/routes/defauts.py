# 📁 app/routes/defauts.py

from fastapi import APIRouter
from typing import List
from app.database.mongo import defauts_collection
from app.models.defaut import Defaut
from bson import ObjectId

router = APIRouter()

@router.get("/defauts", response_model=List[Defaut])
async def get_defauts():
    """
    Récupérer tous les défauts enregistrés dans la base de données.
    """
    defauts = await defauts_collection.find().to_list(length=100)
    return defauts

@router.post("/defauts", response_model=Defaut)
async def create_defaut(defaut: Defaut):
    """
    Insérer un nouveau défaut dans la base de données.
    """
    defaut_dict = defaut.model_dump(by_alias=True)
    result = await defauts_collection.insert_one(defaut_dict)
    defaut_dict["_id"] = result.inserted_id
    return defaut_dict
