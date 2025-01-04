from flask_socketio import SocketIO, join_room, leave_room, emit
from flask import current_app
from models import db, DocumentContent
import logging

socketio = SocketIO()

doc_content = DocumentContent()


def init_socketio(app):
    socketio.init_app(app)


@socketio.on('connect')
def handle_connect():
    emit('status', {'message': 'Connected to the real-time editor!'})


@socketio.on('disconnect')
def handle_disconnect():
    emit('status', {'message': 'A user has disconnected'}, broadcast=True)


@socketio.on('join_document')
def handle_join_document(data):
    document_id = data['document_id']
    user_id = data['user_id']
    room = f'document_{document_id}'
    join_room(room)

    # Ensure we're using the correct app context when interacting with MongoDB
    with current_app.app_context():
        content = doc_content.get_document(document_id)

    if content:
        emit('load_document', {'content': content['content'], 'revision_number': len(content['revisions'])},
             room=user_id)
    else:
        emit('error', {'message': 'Document not found'})


@socketio.on('edit_document')
def handle_edit_document(data):
    document_id = data['document_id']
    content = data['content']
    revision_number = data['revision_number']
    user_id = data['user_id']

    # Ensure we're using the correct app context when saving to MongoDB
    with current_app.app_context():
        doc_content.save_revision(document_id, content, revision_number)

    emit('document_updated', {'content': content, 'revision_number': revision_number}, room=f'document_{document_id}')


@socketio.on('get_document_version')
def handle_get_document_version(data):
    document_id = data['document_id']
    revision_number = data['revision_number']

    # Ensure we're using the correct app context when interacting with MongoDB
    with current_app.app_context():
        document = doc_content.get_document(document_id)

    revision = next((rev for rev in document['revisions'] if rev['revision_number'] == revision_number), None)

    if revision:
        emit('load_document', {
            'content': revision['content'],
            'revision_number': revision['revision_number']
        })
    else:
        emit('error', {'message': 'Revision not found'})
