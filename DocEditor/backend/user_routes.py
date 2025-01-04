from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User
import datetime

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Validate input
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    hashed_password = generate_password_hash(password, method='sha256')

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists"}), 400

    try:
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while creating the user"}), 500

    return jsonify({"message": "User created successfully!"}), 201

@user_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=username, expires_delta=datetime.timedelta(hours=1))
        return jsonify(access_token=access_token), 200

    return jsonify({"message": "Invalid credentials"}), 401


