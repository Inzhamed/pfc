from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.login.database import technicien_collection
import bcrypt

admin_router = APIRouter(prefix="/admin", tags=["Admin"])

class NouveauTechnicien(BaseModel):
    email: EmailStr
    matricule: str  # mot de passe par défaut

class ModifMDP(BaseModel):
    email: EmailStr
    nouveau_mdp: str

@admin_router.post("/ajouter-technicien")
def ajouter_technicien(data: NouveauTechnicien):
    # Vérifier si le technicien existe déjà
    if technicien_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Utilisateur déjà existant")

    hashed = bcrypt.hashpw(data.matricule.encode('utf-8'), bcrypt.gensalt())
    technicien_collection.insert_one({
        "email": data.email,
        "password": hashed,
        "role": "technicien"
    })
    return {"message": "Technicien ajouté avec succès."}

@admin_router.put("/modifier-mdp")
def modifier_mdp(data: ModifMDP):
    hashed = bcrypt.hashpw(data.nouveau_mdp.encode('utf-8'), bcrypt.gensalt())
    result = technicien_collection.update_one(
        {"email": data.email},
        {"$set": {"password": hashed}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return {"message": "Mot de passe mis à jour avec succès."}
