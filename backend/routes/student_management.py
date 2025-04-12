from flask import Blueprint, jsonify
from database.db import get_db_connection  # adjust import path if needed

student_bp = Blueprint('student_bp', __name__, url_prefix='/api')

@student_bp.route('/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, email, year, semester, section FROM users WHERE role = 'student'")
    students = cursor.fetchall()

    student_data = []
    for student in students:
        student_data.append({
            'id': student[0],
            'name': student[1],
            'email': student[2],
            'year': student[3],
            'semester': student[4],
            'class': student[5]  # still use 'class' in frontend for naming
        })

    conn.close()
    return jsonify(student_data)
