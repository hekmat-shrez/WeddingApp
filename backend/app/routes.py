# from flask import Flask, request, jsonify, abort
# from app import app, mongo
# from app.models import User
# from app.utils import generate_jwt, decode_jwt
# from werkzeug.security import check_password_hash
# from flask_cors import CORS
# from functools import wraps

# # Configure CORS properly - this is the key change
# CORS(app, resources={r"/*": {
#     "origins": "http://localhost:3000",
#     "methods": ["GET", "POST", "OPTIONS"],
#     "allow_headers": ["Content-Type", "Authorization"]
# }})

# # Token validation decorator
# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         auth_header = request.headers.get('Authorization')
#         if not auth_header or not auth_header.startswith("Bearer "):
#             return jsonify({"error": "Missing or invalid token"}), 401
            
#         token = auth_header.split(" ")[1]
#         try:
#             decoded = decode_jwt(token)
#             return f(decoded, *args, **kwargs)
#         except Exception as e:
#             return jsonify({"error": "Invalid or expired token"}), 401
    
#     return decorated

# # Signup Route
# @app.route('/auth/signup', methods=['POST', 'OPTIONS'])
# def signup():
#     if request.method == 'OPTIONS':
#         return jsonify({}), 200
        
#     data = request.json
#     if not data or not data.get('email') or not data.get('password'):
#         return jsonify({"error": "Email and password are required"}), 400

#     if User.get_by_email(data['email']):
#         return jsonify({"error": "User already exists"}), 400

#     user = User(email=data['email'], password=data['password'])
#     user.save()  # Ensure this saves the user to your database
    
#     # Generate token for immediate login after signup
#     token = generate_jwt({"email": user.email})
#     return jsonify({"message": "User created successfully", "token": token}), 201


# # Login Route
# @app.route('/auth/login', methods=['POST', 'OPTIONS'])
# def login():
#     if request.method == 'OPTIONS':
#         return jsonify({}), 200
        
#     data = request.json
#     if not data or not data.get('email') or not data.get('password'):
#         return jsonify({"error": "Email and password are required"}), 400

#     user = User.get_by_email(data['email'])
#     if not user or not check_password_hash(user.password, data['password']):
#         return jsonify({"error": "Invalid email or password"}), 401

#     token = generate_jwt({"email": user.email})  # Generate JWT Token
#     return jsonify({"token": token}), 200


# # Protected Route (requires token)
# @app.route('/auth/protected', methods=['GET', 'OPTIONS'])
# @token_required
# def protected(user_data):
#     if request.method == 'OPTIONS':
#         return jsonify({}), 200
        
#     return jsonify({"message": "This is a protected route", "user": user_data}), 200


# # Save Checklist Route
# @app.route('/api/checklist', methods=['POST', 'OPTIONS'])
# @token_required
# def save_checklist(user_data):
#     if request.method == 'OPTIONS':
#         return jsonify({}), 200
        
#     data = request.json
#     email = data.get('email')
#     checklist = data.get('checklist')

#     # Verify the token email matches the request email
#     if user_data['email'] != email:
#         return jsonify({"error": "Unauthorized access"}), 403

#     if not checklist:
#         return jsonify({"error": "Checklist required"}), 400

#     mongo.db.users.update_one({"email": email}, {"$set": {"checklist": checklist}})
#     return jsonify({"message": "Checklist saved"}), 200


# # Save Budget Route
# @app.route('/api/budget', methods=['POST', 'OPTIONS'])
# @token_required
# def save_budget(user_data):
#     if request.method == 'OPTIONS':
#         return jsonify({}), 200
        
#     data = request.json
#     email = data.get('email')
#     budget = data.get('budget')

#     # Verify the token email matches the request email
#     if user_data['email'] != email:
#         return jsonify({"error": "Unauthorized access"}), 403

#     if not budget:
#         return jsonify({"error": "Budget required"}), 400

#     mongo.db.users.update_one({"email": email}, {"$set": {"budget": budget}})
#     return jsonify({"message": "Budget saved"}), 200


# # Save Guests Route
# @app.route('/api/guests', methods=['POST', 'OPTIONS'])
# @token_required
# def save_guests(user_data):
#     if request.method == 'OPTIONS':
#         return jsonify({}), 200
        
#     data = request.json
#     email = data.get('email')
#     guests = data.get('guests')

#     # Verify the token email matches the request email
#     if user_data['email'] != email:
#         return jsonify({"error": "Unauthorized access"}), 403

#     if not guests:
#         return jsonify({"error": "Guests required"}), 400

#     mongo.db.users.update_one({"email": email}, {"$set": {"guests": guests}})
#     return jsonify({"message": "Guest list saved"}), 200


# # Dashboard Route
# @app.route('/api/dashboard/<email>', methods=['GET', 'OPTIONS'])
# @token_required
# def get_dashboard(user_data, email):
#     if request.method == 'OPTIONS':
#         return jsonify({}), 200
    
#     # Verify the token email matches the request email
#     if user_data['email'] != email:
#         return jsonify({"error": "Unauthorized access"}), 403
        
#     user_data = mongo.db.users.find_one({"email": email}, {"_id": 0, "password": 0})
#     if not user_data:
#         return jsonify({"error": "User not found"}), 404

#     return jsonify(user_data), 200


# # Home Route (API health check)
# @app.route('/', methods=['GET', 'OPTIONS'])
# def home():
#     if request.method == 'OPTIONS':
#         return jsonify({}), 200
        
#     return jsonify({"message": "🚀 Backend is up and running!"}), 200

from flask import Flask, request, jsonify, abort
from app import app, mongo
from app.models import User
from app.utils import generate_jwt, decode_jwt
from werkzeug.security import check_password_hash
from flask_cors import CORS
from functools import wraps

# Configure CORS properly
CORS(app, resources={r"/*": {
    "origins": "http://localhost:3000",
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

# Token validation decorator - only for non-OPTIONS requests
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401
            
        token = auth_header.split(" ")[1]
        try:
            decoded = decode_jwt(token)
            return f(decoded, *args, **kwargs)
        except Exception as e:
            return jsonify({"error": f"Invalid or expired token: {str(e)}"}), 401
    
    return decorated

# Global OPTIONS handler for any route
@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    return jsonify({}), 200

# Signup Routes
@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    if User.get_by_email(data['email']):
        return jsonify({"error": "User already exists"}), 400

    user = User(email=data['email'], password=data['password'])
    user.save()  # Ensure this saves the user to your database
    
    # Generate token for immediate login after signup
    token = generate_jwt({"email": user.email})
    return jsonify({"message": "User created successfully", "token": token}), 201

# Login Route
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.get_by_email(data['email'])
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_jwt({"email": user.email})  # Generate JWT Token
    return jsonify({"token": token}), 200

# Protected Route (requires token)
@app.route('/auth/protected', methods=['GET'])
@token_required
def protected(user_data):
    return jsonify({"message": "This is a protected route", "user": user_data}), 200

# Save Checklist Route
@app.route('/api/checklist', methods=['POST'])
@token_required
def save_checklist(user_data):
    data = request.json
    email = data.get('email')
    checklist = data.get('checklist')

    # Verify the token email matches the request email
    if user_data['email'] != email:
        return jsonify({"error": "Unauthorized access"}), 403

    if not checklist:
        return jsonify({"error": "Checklist required"}), 400

    mongo.db.users.update_one({"email": email}, {"$set": {"checklist": checklist}})
    return jsonify({"message": "Checklist saved"}), 200

# Save Budget Route
@app.route('/api/budget', methods=['POST'])
@token_required
def save_budget(user_data):
    data = request.json
    email = data.get('email')
    budget = data.get('budget')

    # Verify the token email matches the request email
    if user_data['email'] != email:
        return jsonify({"error": "Unauthorized access"}), 403

    if not budget:
        return jsonify({"error": "Budget required"}), 400

    mongo.db.users.update_one({"email": email}, {"$set": {"budget": budget}})
    return jsonify({"message": "Budget saved"}), 200

# Save Guests Route
@app.route('/api/guests', methods=['POST'])
@token_required
def save_guests(user_data):
    data = request.json
    email = data.get('email')
    guests = data.get('guests')

    # Verify the token email matches the request email
    if user_data['email'] != email:
        return jsonify({"error": "Unauthorized access"}), 403

    if not guests:
        return jsonify({"error": "Guests required"}), 400

    mongo.db.users.update_one({"email": email}, {"$set": {"guests": guests}})
    return jsonify({"message": "Guest list saved"}), 200

# Dashboard Route
@app.route('/api/dashboard/<email>', methods=['GET'])
@token_required
def get_dashboard(user_data, email):
    # Verify the token email matches the requested email
    if user_data['email'] != email:
        return jsonify({"error": "Unauthorized access"}), 403
        
    user_data = mongo.db.users.find_one({"email": email}, {"_id": 0, "password": 0})
    if not user_data:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user_data), 200

# Home Route (API health check)
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "🚀 Backend is up and running!"}), 200