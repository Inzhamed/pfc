from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import List
import os
from datetime import datetime

from app.crud.report import (
    create_report,
    get_report,
    get_all_reports,
    update_report,
    delete_report
)
from app.models.report import Report, ReportCreate

router = APIRouter()

@router.post("/", response_model=Report)
async def create_new_report(report: ReportCreate):
    return await create_report(report)

@router.get("/", response_model=List[Report])
async def read_reports(skip: int = 0, limit: int = 100):
    return await get_all_reports(skip, limit)

@router.get("/{report_id}", response_model=Report)
async def read_report(report_id: str):
    report = await get_report(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.put("/{report_id}", response_model=Report)
async def update_existing_report(report_id: str, report: ReportCreate):
    updated = await update_report(report_id, report)
    if not updated:
        raise HTTPException(status_code=404, detail="Report not found")
    return await get_report(report_id)

@router.delete("/{report_id}")
async def remove_report(report_id: str):
    deleted = await delete_report(report_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Report deleted successfully"}