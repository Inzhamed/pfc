from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.settings.schemas import PasswordChangeRequest, PasswordChangeResponse, LogoutResponse
from app.settings.models import change_user_password
from app.login.database import technicien_collection
from jose import JWTError, jwt
from app.login.utils import verify_password

router = APIRouter(prefix="/settings", tags=["Settings"])

# Configuration JWT (même que dans votre auth.py)
SECRET_KEY = "ta_clé_secrète"  # Utilisez la même clé que dans auth.py
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user_email(token: str = Depends(oauth2_scheme)) -> str:
    """
    Récupère l'email de l'utilisateur actuel à partir du token JWT
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")  # Supposant que l'email est stocké dans "sub"
        if user_email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_email
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/change-password", response_model=PasswordChangeResponse)
def change_password(
    request: PasswordChangeRequest,
    current_user_email: str = Depends(get_current_user_email)
):
    """
    Endpoint pour changer le mot de passe de l'utilisateur connecté
    """
    try:
        # Vérifier que le nouveau mot de passe est différent de l'ancien
        if request.current_password == request.new_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le nouveau mot de passe doit être différent de l'ancien"
            )
        
        # Changer le mot de passe
        success = change_user_password(
            current_user_email, 
            request.current_password, 
            request.new_password
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mot de passe actuel incorrect ou erreur lors de la mise à jour"
            )
        
        return PasswordChangeResponse(
            message="Mot de passe modifié avec succès",
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur interne du serveur"
        )

@router.post("/logout", response_model=LogoutResponse)
def logout():
    """
    Endpoint pour la déconnexion
    Note: Dans une implémentation JWT stateless, la déconnexion se fait côté client
    en supprimant le token. Ce endpoint peut être utilisé pour des logs ou d'autres actions.
    """
    return LogoutResponse(
        message="Déconnexion réussie",
        success=True
    )
