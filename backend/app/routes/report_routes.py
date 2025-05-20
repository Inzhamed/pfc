from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime

from ..database import Database
from ..models.report import ReportCreate, ReportInDB, ReportUpdate

router = APIRouter(prefix="/api/reports", tags=["reports"])

async def get_report_collection():
    db = Database.get_db()
    return db.reports

@router.post("/", response_model=ReportInDB)
async def create_report(report: ReportCreate, collection=Depends(get_report_collection)):
    report_dict = report.dict()
    report_dict["createdAt"] = datetime.now().isoformat()
    
    result = await collection.insert_one(report_dict)
    
    created_report = await collection.find_one({"_id": result.inserted_id})
    return created_report

@router.get("/", response_model=List[ReportInDB])
async def list_reports(collection=Depends(get_report_collection)):
    reports = []
    cursor = collection.find().sort("createdAt", -1)
    async for document in cursor:
        reports.append(document)
    return reports

@router.get("/{report_id}", response_model=ReportInDB)
async def get_report(report_id: str, collection=Depends(get_report_collection)):
    try:
        report = await collection.find_one({"_id": ObjectId(report_id)})
        if report:
            return report
        raise HTTPException(status_code=404, detail=f"Rapport avec l'ID {report_id} non trouvé")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{report_id}", response_model=ReportInDB)
async def update_report(report_id: str, report_data: ReportUpdate, collection=Depends(get_report_collection)):
    try:
        # Filtrer les champs non None
        update_data = {k: v for k, v in report_data.dict().items() if v is not None}
        update_data["updatedAt"] = datetime.now().isoformat()
        
        if not update_data:
            raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
        
        result = await collection.update_one(
            {"_id": ObjectId(report_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail=f"Rapport avec l'ID {report_id} non trouvé")
            
        updated_report = await collection.find_one({"_id": ObjectId(report_id)})
        return updated_report
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{report_id}")
async def delete_report(report_id: str, collection=Depends(get_report_collection)):
    try:
        result = await collection.delete_one({"_id": ObjectId(report_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail=f"Rapport avec l'ID {report_id} non trouvé")
            
        return {"message": "Rapport supprimé avec succès"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
