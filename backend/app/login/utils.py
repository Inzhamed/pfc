# app/login/utils.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hash un mot de passe en clair.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vérifie que le mot de passe en clair correspond au hash stocké.
    """
    return pwd_context.verify(plain_password, hashed_password)
