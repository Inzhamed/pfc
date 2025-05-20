from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class ReportBase(BaseModel):
    technicianName: str
    matricule: str
    function: str
    date: str
    defectType: str
    location: str
    description: str
    actionTaken: str
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ReportCreate(ReportBase):
    pass

class ReportInDB(ReportBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    createdAt: str = Field(default_factory=lambda: datetime.now().isoformat())
    updatedAt: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ReportUpdate(BaseModel):
    technicianName: Optional[str] = None
    matricule: Optional[str] = None
    function: Optional[str] = None
    date: Optional[str] = None
    defectType: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    actionTaken: Optional[str] = None
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
