from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    is_admin: bool = False

class UserCreate(UserBase):
    password: str  # mot de passe brut reçu du frontend

class UserInDB(UserBase):
    password: str  # changer "hashed_password" en "password" pour correspondre à MongoDB

class UserUpdate(BaseModel):
    email: EmailStr
    password: str
    is_admin: bool = False
