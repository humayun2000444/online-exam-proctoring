from flask import Flask
from routes.student_management import student_bp
from routes.auth_routes import auth_routes
from routes.exam_routes import exam_bp
from routes.proctoring_routes import proctoring_bp

# Import your CORS handler
from utils.cors_handler import configure_cors

app = Flask(__name__)

# Setup CORS
configure_cors(app)

# Register all blueprints
app.register_blueprint(auth_routes)
app.register_blueprint(exam_bp)
app.register_blueprint(student_bp)
app.register_blueprint(proctoring_bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
