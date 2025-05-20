from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .database import Database
from .routes.report_routes import router as report_router

app = FastAPI(title="Rail Defect API")

# Configuration CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8000",
    "https://bouchrabenbelkacem-2005.web.app",
    # Ajoutez ici d'autres origines si nécessaire
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    Database.get_client()

@app.on_event("shutdown")
async def shutdown_db_client():
    Database.close_connection()

app.include_router(report_router)

@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API de détection des défauts de rails"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
