# app/routes/upload.py

from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
from uuid import uuid4

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """
    Endpoint pour uploader une image dans le dossier local 'uploads'.
    Retourne l'URL d'accès à l'image.
    """
    try:
        file_ext = os.path.splitext(file.filename)[1]
        unique_name = f"{uuid4().hex}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return JSONResponse({
            "message": "Image uploadée avec succès",
            "filename": unique_name,
            "url": f"/uploads/{unique_name}"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'upload: {str(e)}")
