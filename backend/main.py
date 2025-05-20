from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.login.routes import router as login_router
from app.admin.routes import admin_router

app = FastAPI()

# Autoriser les requêtes du frontend (React avec Vite en dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes API
app.include_router(login_router, prefix="/api", tags=["login"])
app.include_router(admin_router)

# Aucune gestion du frontend ici → c’est Vite qui s’en occupe
