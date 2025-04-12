import bcrypt
from database.db import get_db_connection

def create_user(name, email, password, role, **kwargs):
    """
    Create a new user in the database with password hashing.
    :param name: Full name of the user
    :param email: User's email
    :param password: User's password
    :param role: User's role ('student', 'teacher', 'admin')
    :param kwargs: Additional fields depending on the user role (e.g., birthdate, year, teacher_id, etc.)
    """
    # Hash the password before storing
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    cursor = conn.cursor()

    if role == 'student':
        birthdate = kwargs.get('birthdate')
        year = kwargs.get('year')
        semester = kwargs.get('semester')
        section = kwargs.get('section')
        student_id = kwargs.get('student_id')

        if not (birthdate and year and semester and section and student_id):
            raise ValueError("Missing required fields for student registration")

        cursor.execute("""
            INSERT INTO users (name, email, password, role, birthdate, year, semester, section, student_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (name, email, hashed_password, role, birthdate, year, semester, section, student_id))

    elif role == 'teacher':
        teacher_id = kwargs.get('teacher_id')
        position = kwargs.get('position')
        designation = kwargs.get('designation')

        if not (teacher_id and position and designation):
            raise ValueError("Missing required fields for teacher registration")

        cursor.execute("""
            INSERT INTO users (name, email, password, role, teacher_id, position, designation)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (name, email, hashed_password, role, teacher_id, position, designation))

    else:
        cursor.execute("""
            INSERT INTO users (name, email, password, role)
            VALUES (%s, %s, %s, %s)
        """, (name, email, hashed_password, role))

    conn.commit()
    conn.close()

def get_user_by_email(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    conn.close()
    return user
