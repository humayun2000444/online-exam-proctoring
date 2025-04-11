from flask import Blueprint, request, jsonify
from models.user_model import create_user, get_user_by_email
import bcrypt
from utils.jwt_helper import generate_token

auth_routes = Blueprint('auth_routes', __name__)

@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid or missing JSON payload"}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'student')  # Default: student

    if not name or not email or not password:
        return jsonify({"message": "Missing name, email, or password"}), 400

    user = get_user_by_email(email)
    if user:
        return jsonify({"message": "User already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    create_user(name, email, hashed_pw.decode('utf-8'), role)

    return jsonify({"message": "User registered successfully"}), 201


@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid or missing JSON payload"}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = get_user_by_email(email)
    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    user_id, name, email, hashed_pw, role = user
    if not bcrypt.checkpw(password.encode('utf-8'), hashed_pw.encode('utf-8')):
        return jsonify({"message": "Invalid password"}), 401

    token = generate_token(user_id, role)
    return jsonify({
        "message": "Login successful",
        "token": token,
        "role": role,
        "name": name
    }), 200
