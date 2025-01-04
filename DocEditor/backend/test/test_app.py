import pytest
from app import app, db
from models import User, Document
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    """Fixture to set up test client."""
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Use in-memory SQLite for testing
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Create the database schema
        yield client
        with app.app_context():
            db.session.remove()
            db.drop_all()

# Test User Registration
def test_user_register(client):
    response = client.post('/user/register', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert response.status_code == 201
    assert response.json['message'] == 'User created successfully!'

# Test User Login
def test_user_login(client):
    client.post('/user/register', json={'username': 'testuser', 'password': 'testpassword'})
    response = client.post('/user/login', json={'username': 'testuser', 'password': 'testpassword'})
    assert response.status_code == 200
    assert 'access_token' in response.json

# Test Document Creation
def test_create_document(client):
    response = client.post('/user/login', json={'username': 'testuser', 'password': 'testpassword'})
    token = response.json['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    response = client.post('/document/', json={'title': 'Test Document', 'description': 'Test desc'}, headers=headers)
    assert response.status_code == 201
    assert 'Document created' in response.json['message']

# Test Document Fetching
def test_get_document(client):
    response = client.post('/user/login', json={'username': 'testuser', 'password': 'testpassword'})
    token = response.json['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    client.post('/document/', json={'title': 'Test Document', 'description': 'Test desc'}, headers=headers)
    response = client.get('/document/1', headers=headers)
    assert response.status_code == 200
    assert response.json['title'] == 'Test Document'

# Test Document Deletion
def test_delete_document(client):
    response = client.post('/user/login', json={'username': 'testuser', 'password': 'testpassword'})
    token = response.json['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    client.post('/document/', json={'title': 'Test Document', 'description': 'Test desc'}, headers=headers)
    response = client.delete('/document/1', headers=headers)
    assert response.status_code == 200
    assert response.json['message'] == 'Document deleted'
