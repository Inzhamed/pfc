from pydantic import BaseModel, EmailStr, Field
from app.login.database import technicien_collection
from app.login.utils import verify_password

# Modèle utilisé pour stocker un utilisateur complet en base (avec mot de passe hashé)
class User(BaseModel):
    email: EmailStr
    password: str  # ici on met "password" car MongoDB a cette clé
    is_admin: bool = False

# Modèle utilisé pour la création via Swagger (avec mot de passe en clair)
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4)
    is_admin: bool = False

# Modèle de réponse (optionnel, utilisé pour cacher le hash du mot de passe)
class UserResponse(BaseModel):
    email: EmailStr
    is_admin: bool

    class Config:
        from_attributes = True  # remplace orm_mode pour Pydantic V2

# Fonction de vérification
def verify_technicien(email: str, password: str):
    user = technicien_collection.find_one({"email": email})
    if user and "password" in user:
        hashed_password = user["password"]
        # Si le hash est stocké en binaire, il faut le décoder en string
        if isinstance(hashed_password, bytes):
            hashed_password = hashed_password.decode("utf-8")
        if verify_password(password, hashed_password):
            return user
    return None
