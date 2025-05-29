# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from models import Report
import database

from app.login.routes import router as login_router
from app.admin.routes import admin_router
from app.settings.routes import router as settings_router
from app.routes import defauts, upload  # routes de backend-malek

app = FastAPI(
    title="Rail Defect Detection API",
    description="Backend API for managing and predicting rail defects.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change * en prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montre les fichiers statiques (ex: images uploadées)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ✅ Inclusion de TOUTES les routes
app.include_router(login_router, prefix="/api", tags=["login"])
app.include_router(admin_router)
app.include_router(settings_router, prefix="/api", tags=["settings"])
app.include_router(defauts.router, tags=["Défauts"])
app.include_router(upload.router, tags=["Upload"])

# ✅ Route racine
@app.get("/")
def root():
    return {"message": "API de Gestion des Défauts de Rails"}

# ✅ Routes de gestion des rapports
@app.get("/api/reports")
async def get_reports():
    reports = await database.get_all_reports()
    return reports

@app.get("/api/reports/{report_id}")
async def get_report(report_id: str):
    report = await database.get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Rapport non trouvé")
    return report

@app.post("/api/reports")
async def create_report(report: Report):
    created_report = await database.create_report(report)
    return created_report

@app.put("/api/reports/{report_id}")
async def update_report(report_id: str, report: Report):
    existing_report = await database.get_report_by_id(report_id)
    if not existing_report:
        raise HTTPException(status_code=404, detail="Rapport non trouvé")
    updated_report = await database.update_report(report_id, report)
    return updated_report

@app.delete("/api/reports/{report_id}")
async def delete_report(report_id: str):
    success = await database.delete_report(report_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rapport non trouvé")
    return {"message": "Rapport supprimé avec succès"}
