from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Document, DocumentContent

document_blueprint = Blueprint('document', __name__)


@document_blueprint.route('/documents', methods=['POST'])
@jwt_required()
def create_document():
    data = request.get_json()
    title = data['title']
    description = data.get('description', '')
    user_id = get_jwt_identity()

    new_document = Document(title=title, description=description, user_id=user_id)
    db.session.add(new_document)
    db.session.commit()

    return jsonify({"message": "Document created", "document_id": new_document.id}), 201


@document_blueprint.route('/api/documents/<int:document_id>', methods=['GET'])
@jwt_required()
def get_document(document_id):
    document = Document.query.get_or_404(document_id)
    return jsonify({
        "title": document.title,
        "description": document.description
    })


@document_blueprint.route('/api/documents/<int:document_id>', methods=['PUT'])
@jwt_required()
def update_document(document_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    document = Document.query.get_or_404(document_id)

    if title:
        document.title = title
    if description:
        document.description = description

    db.session.commit()
    return jsonify({"message": "Document updated"}), 200


@document_blueprint.route('/<int:document_id>', methods=['DELETE'])
@jwt_required()
def delete_document(document_id):
    document = Document.query.get_or_404(document_id)
    db.session.delete(document)
    db.session.commit()
    return jsonify({"message": "Document deleted"}), 200
