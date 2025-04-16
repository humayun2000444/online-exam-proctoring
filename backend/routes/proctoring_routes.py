from flask import Blueprint, request, jsonify
from proctoring.proctoring import get_analysis, yolov3_model_v3_path, refine_detection, adjust_threshold
from datetime import datetime

proctoring_bp = Blueprint('proctoring', __name__)

# Load the YOLOv3 model at the time the route file is loaded
yolov3_model_v3_path("models/yolov3.weights", "models/yolov3.cfg", "models/coco.names")

log_storage = []

@proctoring_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    image_base64 = data.get("image")

    result = get_analysis(image_base64, "models/shape_predictor_68_face_landmarks.dat")
    refined_result = refine_detection(result)
    adjusted_result = adjust_threshold(refined_result)

    log = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "mob_status": adjusted_result["mob_status"],
        "person_status": adjusted_result["person_status"],
        "user_move1": adjusted_result["user_move1"],
        "user_move2": adjusted_result["user_move2"]
    }

    log_storage.append(log)
    return jsonify(adjusted_result)

@proctoring_bp.route("/logs", methods=["GET"])
def get_logs():
    return jsonify(log_storage[-20:])
