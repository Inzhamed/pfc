# app/login/routes.py
from fastapi import APIRouter, HTTPException, status
from app.login.database import technicien_collection
from app.login import schemas, utils
from bson.objectid import ObjectId
from fastapi import Depends
from .models import verify_technicien 
from app.login.database import db
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter(prefix="/techniciens", tags=["Techniciens"])

# Configuration JWT
SECRET_KEY = "ta_clé_secrète"  # Même clé que dans settings/routes.py
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Crée un token JWT
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_technicien(user: schemas.UserCreate):
    if technicien_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    hashed_pw = utils.hash_password(user.password)
    new_user = {
        "email": user.email,
        "password": hashed_pw,
        "is_admin": user.is_admin
    }
    result = technicien_collection.insert_one(new_user)
    return {
        "_id": str(result.inserted_id),
        "email": user.email,
        "is_admin": user.is_admin
    }

@router.get("/")
def list_techniciens():
    users = technicien_collection.find()
    return [
        {
            "_id": str(user["_id"]),
            "email": user["email"],
            "is_admin": user.get("is_admin", False)
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
    
    # Créer le token JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": technicien["email"]},  # "sub" contient l'email
        expires_delta=access_token_expires
    )
    
    return {
        "message": "Connexion réussie",
        "email": technicien["email"],
        "is_admin": technicien.get("is_admin", False),
        "access_token": access_token,  # NOUVEAU : token JWT
        "token_type": "bearer"
    }

@router.put("/{user_id}")
def update_technicien(user_id: str, updated_data: schemas.UserUpdate):
    update_fields = {}
    if updated_data.email:
        update_fields["email"] = updated_data.email
    if updated_data.password:
        update_fields["password"] = utils.hash_password(updated_data.password)
    if updated_data.is_admin is not None:
        update_fields["is_admin"] = updated_data.is_admin

    result = technicien_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Technicien non trouvé")
    return {"message": "Technicien mis à jour"}
