

from app.login.database import technicien_collection
import bcrypt

def creer_admin():
    motdepasse = "admin123"
    motdepasse_hash = bcrypt.hashpw(motdepasse.encode('utf-8'), bcrypt.gensalt())

    technicien_collection.insert_one({
        "email": "admin@stnf.com",
        "password": motdepasse_hash,
        "role": "admin"
    })

if __name__ == "__main__":
    creer_admin()
    print("Admin créé !")
