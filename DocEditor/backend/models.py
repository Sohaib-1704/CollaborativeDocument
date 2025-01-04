from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient
from flask import current_app

db = SQLAlchemy()


class DocumentContent:
    def __init__(self):
        self.client = None
        self.collection = None

    def _init_mongo(self):
        if current_app.config.get('MONGO_URI'):
            self.client = MongoClient(current_app.config['MONGO_URI'])
            self.collection = self.client['collabwrite']['documents']

    def get_document(self, document_id):
        if not self.collection:
            self._init_mongo()
        return self.collection.find_one({"document_id": document_id})

    def save_revision(self, document_id, content, revision_number):
        if not self.collection:
            self._init_mongo()
        document = self.collection.find_one({"document_id": document_id})
        if document:
            self.collection.update_one(
                {"document_id": document_id},
                {"$push": {"revisions": {"revision_number": revision_number, "content": content}}}
            )
        else:
            self.collection.insert_one({
                "document_id": document_id,
                "revisions": [{"revision_number": revision_number, "content": content}]
            })


# SQLAlchemy Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)


class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(500))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('documents', lazy=True))

