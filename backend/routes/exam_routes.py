# src/routes/exam_routes.py

from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
from models.exam_model import (
    create_exam, get_all_exams,
    save_proctoring_alert, save_exam_submission,
    get_student_result, get_all_results
)

exam_bp = Blueprint('exam', __name__)
SECRET_KEY = "your_secret_key"  # 🔐 Move this to .env or config file later

# ------------------ TOKEN VERIFICATION MIDDLEWARE ------------------ #
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token missing!"}), 401

        try:
            if token.startswith("Bearer "):
                token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return f(user_id=data.get('user_id'), role=data.get('role'), *args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token invalid!"}), 403
        except Exception as e:
            print(f"[ERROR] Token processing error: {e}")
            return jsonify({"message": "Internal server error"}), 500

    return decorated


# ------------------ EXAM ROUTES ------------------ #

@exam_bp.route('/create_exam', methods=['POST'])
@token_required
def create_exam_route(user_id, role):
    if role not in ['teacher', 'admin']:
        return jsonify({"message": "Access denied!"}), 403

    data = request.get_json()
    try:
        create_exam(
            title=data.get('title'),
            description=data.get('description'),
            date=data.get('date'),
            duration=data.get('duration'),
            created_by=user_id
        )
        return jsonify({"message": "✅ Exam created successfully!"})
    except Exception as e:
        print(f"[ERROR] Failed to create exam: {e}")
        return jsonify({"message": "Failed to create exam"}), 500


@exam_bp.route('/get_exams', methods=['GET'])
@token_required
def get_exams_route(user_id, role):
    try:
        exams = get_all_exams()
        return jsonify(exams)
    except Exception as e:
        print(f"[ERROR] Fetching exams failed: {e}")
        return jsonify({"message": "Failed to get exams"}), 500


@exam_bp.route('/report_proctor_alert', methods=['POST'])
@token_required
def report_proctor_alert(user_id, role):
    data = request.get_json()
    try:
        save_proctoring_alert(user_id, data['message'], data['timestamp'])
        return jsonify({"message": "Alert saved"})
    except Exception as e:
        print(f"[ERROR] Saving proctor alert: {e}")
        return jsonify({"message": "Failed to save alert"}), 500


@exam_bp.route('/submit_exam', methods=['POST'])
@token_required
def submit_exam(user_id, role):
    data = request.get_json()
    try:
        save_exam_submission(user_id, data['exam_id'], data['reason'], data['timestamp'])
        return jsonify({"message": "Exam submitted & saved!"})
    except Exception as e:
        print(f"[ERROR] Saving exam submission: {e}")
        return jsonify({"message": "Failed to submit exam"}), 500

@exam_bp.route('/student/results', methods=['GET'])
@token_required
def student_results(user_id, role):
    try:
        result = get_student_result(user_id)
        return jsonify(result)
    except Exception as e:
        print(f"[ERROR] Fetching student result: {e}")
        return jsonify({"message": "Failed to fetch results"}), 500


@exam_bp.route('/admin/results', methods=['GET'])
@token_required
def admin_results(user_id, role):
    if role != 'admin':
        return jsonify({"message": "Access denied!"}), 403
    try:
        results = get_all_results()
        return jsonify(results)
    except Exception as e:
        print(f"[ERROR] Fetching all results: {e}")
        return jsonify({"message": "Failed to fetch results"}), 500
