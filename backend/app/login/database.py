from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["railvision_db"]
technicien_collection = db["techniciens"]
