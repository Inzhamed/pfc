from bson import ObjectId
from app.database import reports_collection
from app.models.report import Report, ReportCreate

async def create_report(report_data: ReportCreate) -> Report:
    report_dict = report_data.dict()
    new_report = await reports_collection.insert_one(report_dict)
    created_report = await reports_collection.find_one({"_id": new_report.inserted_id})
    return Report(**created_report)

async def get_report(report_id: str) -> Report:
    report = await reports_collection.find_one({"_id": ObjectId(report_id)})
    if report:
        return Report(**report)
    return None

async def get_all_reports(skip: int = 0, limit: int = 100):
    reports = []
    async for report in reports_collection.find().skip(skip).limit(limit):
        reports.append(Report(**report))
    return reports

async def update_report(report_id: str, report_data: dict):
    if isinstance(report_data, dict):
        update_data = {k: v for k, v in report_data.items() if v is not None}
    else:
        update_data = report_data.dict(exclude_unset=True)
    
    if len(update_data) >= 1:
        result = await reports_collection.update_one(
            {"_id": ObjectId(report_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0
    return False

async def delete_report(report_id: str):
    result = await reports_collection.delete_one({"_id": ObjectId(report_id)})
    return result.deleted_count > 0