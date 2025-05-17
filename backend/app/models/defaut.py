from pydantic import BaseModel, Field, HttpUrl
from typing import Optional
from bson import ObjectId

# Pour convertir l'ObjectId de MongoDB
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

# Modèle de données pour un défaut ferroviaire
class Defaut(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    latitude: float
    longitude: float
    type: str  # joint / squad / ssquad
    niveau: str  # critique / modéré / mineur
    description: Optional[str] = None
    date: Optional[str] = None  # Format "YYYY-MM-DD"
    statut: Optional[str] = "non-résolu"  # ou "résolu"
    photo_url: Optional[HttpUrl] = None
    region: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
