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
    role = data.get('role', 'student')  # Default to student

    if not name or not email or not password:
        return jsonify({"message": "Missing name, email, or password"}), 400

    if get_user_by_email(email):
        return jsonify({"message": "User already exists"}), 400

    try:
        # Handle role-specific required fields
        if role == 'student':
            create_user(
                name, email, password, role,
                birthdate=data.get('birthdate'),
                year=data.get('year'),
                semester=data.get('semester'),
                section=data.get('section'),
                student_id=data.get('student_id')
            )
        elif role == 'teacher':
            create_user(
                name, email, password, role,
                teacher_id=data.get('teacher_id'),
                position=data.get('position'),
                designation=data.get('designation')
            )
        else:
            # For roles like admin
            create_user(name, email, password, role)

        return jsonify({"message": "User registered successfully"}), 201

    except ValueError as ve:
        return jsonify({"message": str(ve)}), 400
    except Exception as e:
        print("Error:", e)
        return jsonify({"message": "Internal server error"}), 500


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

    user_id = user[0]
    name = user[1]
    db_email = user[2]
    hashed_pw = user[3]
    role = user[4]

    if not bcrypt.checkpw(password.encode('utf-8'), hashed_pw.encode('utf-8')):
        return jsonify({"message": "Invalid password"}), 401

    token = generate_token(user_id, role)

    return jsonify({
        "message": "Login successful",
        "token": token,
        "role": role,
        "name": name
    }), 200
