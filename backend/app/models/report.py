from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
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
    technician_name: str
    technician_id: str
    technician_role: str
    report_date: str
    location: str
    railway_line: str
    kilometer_point: str
    defect_type: str
    description: str
    action_taken: str
    image_path: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}