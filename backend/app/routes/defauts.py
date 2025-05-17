from fastapi import APIRouter
from app.database.mongo import defauts_collection
from app.models.defaut import Defaut
from typing import List

router = APIRouter()

@router.get("/defauts", response_model=List[Defaut])
async def get_defauts():
    defauts = await defauts_collection.find().to_list(length=100)
    return defauts
