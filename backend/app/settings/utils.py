from app.login.utils import hash_password, verify_password

def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Valide la force du mot de passe
    Retourne (is_valid, error_message)
    """
    if len(password) < 4:
        return False, "Le mot de passe doit contenir au moins 4 caractères"
    
    if len(password) < 8:
        return True, "Mot de passe faible - recommandé: au moins 8 caractères"
    
    return True, "Mot de passe valide"

def sanitize_user_data(user_data: dict) -> dict:
    """
    Nettoie les données utilisateur avant de les retourner
    """
    safe_data = user_data.copy()
    if "password" in safe_data:
        del safe_data["password"]
    return safe_data
