# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes import defauts, upload

app = FastAPI(
    title="Rail Defect Detection API",
    description="Backend API for managing and predicting rail defects.",
    version="1.0.0"
)

# CORS Middleware (utile si le frontend tourne sur un autre domaine ou port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, restreindre aux domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montre les fichiers statiques (pour accéder aux images uploadées)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Inclusion des routes
app.include_router(defauts.router, tags=["Défauts"])
app.include_router(upload.router, tags=["Upload"])

# Optionnel : une route de test
@app.get("/")
def read_root():
    return {"message": "API Rail Defect Detection en fonctionnement"}
