import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "postgresql://localhost/collab_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/collabwrite")
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads/")
    SECRET_KEY = os.getenv("SECRET_KEY", "your-flask-secret-key")
