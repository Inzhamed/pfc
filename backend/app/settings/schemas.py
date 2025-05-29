from pydantic import BaseModel, Field

class PasswordChangeRequest(BaseModel):
    current_password: str = Field(..., min_length=1, description="Mot de passe actuel")
    new_password: str = Field(..., min_length=4, description="Nouveau mot de passe (minimum 4 caractères)")

class PasswordChangeResponse(BaseModel):
    message: str
    success: bool

class LogoutResponse(BaseModel):
    message: str
    success: bool
