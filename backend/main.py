from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Report
import database

from app.login.routes import router as login_router
from app.admin.routes import admin_router
from app.settings.routes import router as settings_router  # Nouvelle ligne

app = FastAPI()

# Autoriser les requêtes du frontend (React avec Vite en dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes login, admin et settings
app.include_router(login_router, prefix="/api", tags=["login"])
app.include_router(admin_router)
app.include_router(settings_router, prefix="/api", tags=["settings"])  # Nouvelle ligne

# Routes CRUD pour les rapports
@app.get("/")
async def root():
    return {"message": "API de Gestion des Défauts de Rails"}

@app.get("/api/reports")
async def get_reports():
    """Récupérer tous les rapports de défauts"""
    reports = await database.get_all_reports()
    return reports

@app.get("/api/reports/{report_id}")
async def get_report(report_id: str):
    """Récupérer un rapport spécifique par son ID"""
    report = await database.get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Rapport non trouvé")
    return report

@app.post("/api/reports")
async def create_report(report: Report):
    """Créer un nouveau rapport de défaut"""
    created_report = await database.create_report(report)
    return created_report

@app.put("/api/reports/{report_id}")
async def update_report(report_id: str, report: Report):
    """Mettre à jour un rapport existant"""
    existing_report = await database.get_report_by_id(report_id)
    if not existing_report:
        raise HTTPException(status_code=404, detail="Rapport non trouvé")
    updated_report = await database.update_report(report_id, report)
    return updated_report

@app.delete("/api/reports/{report_id}")
async def delete_report(report_id: str):
    """Supprimer un rapport"""
    success = await database.delete_report(report_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rapport non trouvé")
    return {"message": "Rapport supprimé avec succès"}
