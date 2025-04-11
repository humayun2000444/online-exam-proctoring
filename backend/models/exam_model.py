from database.db import get_db_connection

# ---------------------- Create Exam ----------------------
def create_exam(title, description, date, duration, created_by):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO exams (title, description, date, duration, created_by)
        VALUES (%s, %s, %s, %s, %s)
    """, (title, description, date, duration, created_by))
    conn.commit()
    conn.close()

# ---------------------- Get All Exams ----------------------
def get_all_exams():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM exams")
    exams = cursor.fetchall()
    conn.close()
    return exams

def save_proctoring_alert(user_id, message, timestamp):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO proctor_alerts (user_id, message, timestamp)
        VALUES (%s, %s, %s)
    """, (user_id, message, timestamp))
    conn.commit()
    conn.close()

# ---------------------- Count Alerts for a User ----------------------
def get_alert_count_by_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM proctoring_alerts WHERE user_id = %s", (user_id,))
    count = cursor.fetchone()[0]
    conn.close()
    return count

# ---------------------- Save Exam Submission ----------------------
def save_exam_submission(user_id, exam_id, reason, timestamp):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO exam_submissions (user_id, exam_id, reason, timestamp, status)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, exam_id, reason, timestamp, "auto-submitted"))
    conn.commit()
    conn.close()

# ---------------------- Get Student Result ----------------------
def get_student_result(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT e.title, s.status, s.timestamp, s.reason
        FROM exam_submissions s
        JOIN exams e ON s.exam_id = e.id
        WHERE s.user_id = %s
    """, (user_id,))
    result = cursor.fetchall()
    conn.close()
    return result

# ---------------------- Get All Results (Admin/Teacher) ----------------------
def get_all_results():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.username, e.title, s.status, s.timestamp, s.reason
        FROM exam_submissions s
        JOIN exams e ON s.exam_id = e.id
        JOIN users u ON u.id = s.user_id
    """)
    result = cursor.fetchall()
    conn.close()
    return result
