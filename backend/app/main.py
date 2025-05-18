from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import reports

app = FastAPI(
    title="SNTF Reports API",
    description="API pour la gestion des rapports de pannes SNTF",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])

@app.get("/")
async def root():
    return {"message": "SNTF Reports API"}