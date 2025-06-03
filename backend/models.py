from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class Location(BaseModel):
    pk: str
    lat: float
    lng: float

class Technician(BaseModel):
    name: str
    matricule: str
    function: str
    interventionDate: str

class Report(BaseModel):
    id: str
    type: str
    status: str
    date: str
    line: str
    description: Optional[str] = None
    technician: Technician
    location: Location
    imageUrl: Optional[str] = None
