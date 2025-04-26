# utils/cors_handler.py

from flask_cors import CORS

def configure_cors(app):
    """
    Configure CORS settings for the Flask app.
    """
    cors = CORS(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000"
            ],
            "supports_credentials": True
        }
    })
