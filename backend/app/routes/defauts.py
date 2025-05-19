# app/routes/defauts.py

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.database.mongo import defauts_collection
from app.models.defaut import Defaut, DefautUpdate
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


@router.get("/defauts/filter", response_model=List[Defaut])
async def filter_defauts(
    type_defaut: Optional[str] = Query(None),
    niveau_defaut: Optional[str] = Query(None),
    statut: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    """
    Récupérer les défauts selon des filtres (type, niveau, statut, région).
    Tous les paramètres sont optionnels.
    """
    query = {}
    if type_defaut:
        query["type_defaut"] = type_defaut
    if niveau_defaut:
        query["niveau_defaut"] = niveau_defaut
    if statut:
        query["statut"] = statut
    if region:
        query["region"] = region

    result = await defauts_collection.find(query).to_list(length=100)
    return result


@router.put("/defauts/{defaut_id}", response_model=Defaut)
async def update_defaut(defaut_id: str, updates: DefautUpdate):
    """
    Mettre à jour un défaut spécifique par son ID.
    """
    try:
        obj_id = ObjectId(defaut_id)
    except:
        raise HTTPException(status_code=400, detail="ID invalide")

    update_data = updates.model_dump(exclude_unset=True)
    result = await defauts_collection.find_one_and_update(
        {"_id": obj_id},
        {"$set": update_data},
        return_document=True
    )
    if result:
        return result
    raise HTTPException(status_code=404, detail="Défaut non trouvé")


@router.delete("/defauts/{defaut_id}")
async def delete_defaut(defaut_id: str):
    """
    Supprimer un défaut par son ID.
    """
    try:
        obj_id = ObjectId(defaut_id)
    except:
        raise HTTPException(status_code=400, detail="ID invalide")

    result = await defauts_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 1:
        return {"message": "Défaut supprimé avec succès"}
    raise HTTPException(status_code=404, detail="Défaut non trouvé")
