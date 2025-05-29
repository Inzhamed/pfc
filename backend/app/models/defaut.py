from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Defaut(BaseModel):
    image_url: Optional[str] = Field(None, description="URL de l'image")
    latitude: float = Field(..., description="Latitude du défaut")
    longitude: float = Field(..., description="Longitude du défaut")
    type_defaut: str = Field(..., description="Type du défaut (joint, squad, ssquad)")
    niveau_defaut: str = Field(..., description="Niveau du défaut (critique, modéré, mineur)")
    description: Optional[str] = Field(None, description="Description du défaut")
    date: datetime = Field(default_factory=datetime.utcnow, description="Date de la détection")
    statut: str = Field(default="non résolu", description="Statut du défaut (résolu / non résolu)")
    region: Optional[str] = Field(None, description="Région où le défaut a été détecté")

    class Config:
        schema_extra = {
            "example": {
                "image_url": "http://localhost:8000/uploads/defaut1.jpg",
                "latitude": 36.75,
                "longitude": 3.05,
                "type_defaut": "joint",
                "niveau_defaut": "critique",
                "description": "Fissure critique au niveau du joint",
                "statut": "non résolu",
                "region": "Alger"
            }
        }

class DefautUpdate(BaseModel):
    statut: str = Field(..., description="Nouveau statut du défaut (résolu / non résolu)")
