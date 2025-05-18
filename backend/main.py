# 📁 backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import defauts  # importe ton fichier de routes

app = FastAPI()

# Middleware CORS (pour autoriser les requêtes cross-origin si besoin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # autoriser tous les domaines pour l'instant
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes des défauts
app.include_router(defauts.router)

# Route racine (facultative)
@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API Rail Defauts"}
