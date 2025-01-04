from flask import Flask, jsonify, current_app
from flask_sqlalchemy import SQLAlchemy
from user_routes import user_blueprint
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config[
    'SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}/{os.getenv('POSTGRES_DB')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


def initialize_mongo():
    mongo_uri = os.getenv('MONGO_URI', 'mongodb://mongo:27017/document_db')
    client = MongoClient(mongo_uri)
    mongo_db = client.get_database()
    document_collection = mongo_db['documents']
    print("MongoDB initialized successfully!")


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config[
        'SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}/{os.getenv('POSTGRES_DB')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    initialize_mongo()

    app.register_blueprint(user_blueprint)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
