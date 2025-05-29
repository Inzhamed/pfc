from pydantic import BaseModel
from app.login.database import technicien_collection
from app.login.utils import verify_password, hash_password
from bson.objectid import ObjectId

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

def change_user_password(user_email: str, current_password: str, new_password: str) -> bool:
    """
    Change le mot de passe d'un utilisateur après vérification du mot de passe actuel
    """
    # Récupérer l'utilisateur par email
    user = technicien_collection.find_one({"email": user_email})
    if not user:
        return False
    
    # Vérifier le mot de passe actuel
    stored_password = user["password"]
    if isinstance(stored_password, bytes):
        stored_password = stored_password.decode("utf-8")
    
    if not verify_password(current_password, stored_password):
        return False
    
    # Hacher le nouveau mot de passe
    new_hashed_password = hash_password(new_password)
    
    # Mettre à jour le mot de passe dans la base de données
    result = technicien_collection.update_one(
        {"email": user_email},
        {"$set": {"password": new_hashed_password}}
    )
    
    return result.modified_count > 0
