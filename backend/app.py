from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_routes
from routes.exam_routes import exam_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_routes)
app.register_blueprint(exam_bp)

if __name__ == '__main__':
    app.run(debug=True)
