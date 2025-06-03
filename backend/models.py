from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

from pydantic import BaseModel, validator
from typing import Union
from datetime import datetime

class Defaut(BaseModel):
    # Autres champs...
    date: Union[datetime, str]

    @validator("date", pre=True)
    def parse_date(cls, v):
        if isinstance(v, datetime):
            return v
        try:
            return datetime.fromisoformat(v)
        except Exception:
            raise ValueError("Invalid datetime format")


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
