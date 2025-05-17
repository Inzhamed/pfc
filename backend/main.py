from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.defauts import router as defaut_router

app = FastAPI()

# Autoriser le frontend à accéder à l’API (important !)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tu peux spécifier "http://localhost:5173" pour plus de sécurité
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(defaut_router)
