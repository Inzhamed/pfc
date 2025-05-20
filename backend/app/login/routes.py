# app/login/routes.py
from fastapi import APIRouter, HTTPException, status
from app.login.database import technicien_collection
from app.login import schemas, utils
from bson.objectid import ObjectId
from fastapi import Depends
from .models import verify_technicien 
from app.login.database import db

router = APIRouter(prefix="/techniciens", tags=["Techniciens"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_technicien(user: schemas.UserCreate):
    if technicien_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    hashed_pw = utils.hash_password(user.password)
    new_user = {
        "email": user.email,
        "password": hashed_pw,  # <== clé modifiée ici
        "is_admin": user.is_admin
    }
    result = technicien_collection.insert_one(new_user)
    return {"id": str(result.inserted_id), "email": user.email}

@router.get("/")
def list_techniciens():
    users = technicien_collection.find()
    return [
        {
            "id": str(user["_id"]),
            "email": user["email"],
            "is_admin": user.get("is_admin", False)  # sécurité si absent
        }
        for user in users
    ]

@router.delete("/{user_id}")
def delete_technicien(user_id: str):
    result = technicien_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return {"message": "Utilisateur supprimé"}

@router.post("/login")
def login(user: schemas.UserCreate):
    technicien = verify_technicien(user.email, user.password)
    if not technicien:
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    return {"message": "Connexion réussie", "email": technicien["email"], "is_admin": technicien.get("is_admin", False)}
