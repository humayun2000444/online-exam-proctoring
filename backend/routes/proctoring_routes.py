from flask import Blueprint, request, jsonify
from proctoring.proctoring import (
    get_analysis,
    yolov3_model_v3_path,
    refine_detection,
    adjust_threshold
)
from datetime import datetime
import threading
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

proctoring_bp = Blueprint('proctoring', __name__)

# Model initialization status
model_initialized = False
initialization_lock = threading.Lock()

# Enhanced log storage with analysis
log_storage = []
analysis_stats = {
    "suspicious_objects": {},
    "movement_patterns": {},
    "audio_events": {},
    "start_time": datetime.now().isoformat(),
    "total_frames_processed": 0
}

def initialize_model():
    """Initialize model in a thread-safe way"""
    global model_initialized

    with initialization_lock:
        if not model_initialized:
            try:
                start_time = time.time()
                yolov3_model_v3_path(
                    "models/yolov3.weights",
                    "models/yolov3.cfg",
                    "models/coco.names"
                )
                model_initialized = True
                logger.info(f"Model initialized in {time.time() - start_time:.2f} seconds")
            except Exception as e:
                logger.error(f"Model initialization failed: {str(e)}")
                raise

# Start model initialization in background
init_thread = threading.Thread(target=initialize_model)
init_thread.start()

@proctoring_bp.route("/analyze", methods=["POST"])
def analyze():
    """Main analysis endpoint with improved error handling"""
    # Wait for model initialization if needed
    if not model_initialized:
        init_thread.join()
        if not model_initialized:
            return jsonify({
                "error": "Model initialization failed",
                "status": "unavailable"
            }), 503

    # Check content type
    if not request.is_json:
        return jsonify({
            "error": "Request must be JSON",
            "status": "bad_request"
        }), 400

    data = request.get_json()
    if not data or "image" not in data:
        return jsonify({
            "error": "No image data provided",
            "status": "bad_request"
        }), 400

    image_base64 = data.get("image")
    if not image_base64 or not isinstance(image_base64, str):
        return jsonify({
            "error": "Invalid image data format",
            "status": "bad_request"
        }), 400

    try:
        result = get_analysis(image_base64)
        if result is None:
            return jsonify({
                "status": "skipped",
                "message": "Processing too frequent"
            }), 200

        if "metadata" in result and result["metadata"]["status"] != "success":
            return jsonify({
                "error": result["metadata"]["status"],
                "status": "processing_error"
            }), 400

        # Rest of your processing...
        refined_result = refine_detection(result)
        adjusted_result = adjust_threshold(refined_result)

        # ... (rest of your logging and response code)

        return jsonify(adjusted_result)

    except Exception as e:
        logger.error(f"Analysis endpoint error: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "status": "error",
            "details": str(e)
        }), 500

@proctoring_bp.route("/logs", methods=["GET"])
def get_logs():
    """Get recent logs and statistics"""
    return jsonify({
        "recent_logs": log_storage[-20:],  # Return last 20 entries
        "statistics": analysis_stats,
        "status": "success"
    })

@proctoring_bp.route("/status", methods=["GET"])
def get_status():
    """Get service status"""
    return jsonify({
        "model_initialized": model_initialized,
        "total_frames_processed": analysis_stats["total_frames_processed"],
        "system_status": "running" if model_initialized else "initializing",
        "start_time": analysis_stats["start_time"],
        "status": "success"
    })

@proctoring_bp.route("/reset", methods=["POST"])
def reset_stats():
    """Reset statistics and logs"""
    global log_storage, analysis_stats

    log_storage = []
    analysis_stats = {
        "suspicious_objects": {},
        "movement_patterns": {},
        "audio_events": {},
        "start_time": datetime.now().isoformat(),
        "total_frames_processed": 0
    }

    return jsonify({
        "status": "reset_successful",
        "timestamp": datetime.now().isoformat()
    })