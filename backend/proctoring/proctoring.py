import cv2
import base64
import numpy as np
import dlib
from collections import deque
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Globals with initialization
net = None
classes = []
layer_names = []
output_layers = []
face_detector = None
face_predictor = None
last_processed_time = 0
processing_interval = 0.1  # seconds between processing frames (10 FPS)

# For movement detection history
movement_history = deque(maxlen=10)
face_position_history = deque(maxlen=5)

def initialize_cuda():
    """Check if CUDA is available and initialize it if possible"""
    cuda_available = False
    try:
        cuda_device_count = cv2.cuda.getCudaEnabledDeviceCount()
        cuda_available = cuda_device_count > 0
        if cuda_available:
            logger.info(f"Found {cuda_device_count} CUDA-capable devices")
        else:
            logger.info("No CUDA devices found")
    except Exception as e:
        logger.warning(f"CUDA check failed: {str(e)}")
        cuda_available = False
    return cuda_available

def yolov3_model_v3_path(weight_path, cfg_path, names_path):
    """Initialize YOLO model with CUDA if available, otherwise fallback to CPU"""
    global net, classes, layer_names, output_layers, face_detector, face_predictor

    try:
        # Load YOLO model
        net = cv2.dnn.readNet(weight_path, cfg_path)
        logger.info("YOLO model loaded successfully")

        # Try to use CUDA if available
        cuda_available = initialize_cuda()
        if cuda_available:
            try:
                net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
                net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)
                logger.info("Using CUDA acceleration for YOLO")
            except Exception as e:
                logger.warning(f"CUDA initialization failed: {str(e)}")
                cuda_available = False

        if not cuda_available:
            net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
            net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
            logger.info("Using CPU for YOLO")

        # Load class names
        with open(names_path, "r") as f:
            classes = [line.strip() for line in f.readlines()]
            logger.info(f"Loaded {len(classes)} class names")

        # Get output layers
        layer_names = net.getLayerNames()
        try:
            output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
        except:
            output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
        logger.info(f"Output layers: {output_layers}")

        # Initialize face detector
        face_detector = dlib.get_frontal_face_detector()
        face_predictor = dlib.shape_predictor("models/shape_predictor_68_face_landmarks.dat")
        logger.info("Face detector initialized")

    except Exception as e:
        logger.error(f"Model initialization failed: {str(e)}")
        raise

def decode_base64_image(base64_string):
    """Decode base64 image with robust error handling"""
    if not base64_string or not isinstance(base64_string, str):
        logger.error("Empty or invalid base64 string provided")
        return None

    try:
        # Remove potential header if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]

        img_data = base64.b64decode(base64_string)
        if not img_data:
            logger.error("Decoded image data is empty")
            return None

        np_array = np.frombuffer(img_data, np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if image is None:
            logger.error("Failed to decode image data")
            return None

        return image
    except base64.binascii.Error as e:
        logger.error(f"Base64 decoding error: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Image decoding error: {str(e)}")
        return None

def detect_objects(image, confidence_threshold=0.5):
    """Detect objects in image with error handling"""
    try:
        height, width = image.shape[:2]

        # Use smaller size for faster processing (320x320 is good balance)
        blob = cv2.dnn.blobFromImage(
            image,
            scalefactor=1/255,
            size=(320, 320),
            swapRB=True,
            crop=False
        )
        net.setInput(blob)
        outs = net.forward(output_layers)

        confidences = []
        class_ids = []
        boxes = []

        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]

                if confidence > confidence_threshold:
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)

                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)

        # Apply non-max suppression to reduce overlapping boxes
        indices = cv2.dnn.NMSBoxes(boxes, confidences, confidence_threshold, 0.4)

        final_boxes = []
        final_confidences = []
        final_class_ids = []

        if len(indices) > 0:
            for i in indices.flatten():
                final_boxes.append(boxes[i])
                final_confidences.append(confidences[i])
                final_class_ids.append(class_ids[i])

        return final_boxes, final_confidences, final_class_ids

    except Exception as e:
        logger.error(f"Object detection failed: {str(e)}")
        return [], [], []

def detect_suspicious_objects(class_ids):
    """Detect suspicious objects for proctoring"""
    suspicious_items = {
        "mobile_phone": False,
        "person": False,
        "electronics": False,
        "book": False,
        "paper": False,
        "headphones": False
    }

    suspicious_classes = {
        "cell phone": "mobile_phone",
        "mobile phone": "mobile_phone",
        "phone": "mobile_phone",
        "person": "person",
        "laptop": "electronics",
        "book": "book",
        "paper": "paper",
        "headphones": "headphones"
    }

    for class_id in class_ids:
        label = classes[class_id].lower()
        for key, value in suspicious_classes.items():
            if key in label:
                suspicious_items[value] = True
                break

    return suspicious_items

def analyze_facial_movement(image):
    """Analyze facial movements and gaze"""
    movement_result = {
        "left_movement": False,
        "right_movement": False,
        "multiple_faces": False,
        "no_face": False,
        "face_distance_change": False,
        "gaze_direction": "center",
        "face_detected": False
    }

    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_detector(gray)

        movement_result["multiple_faces"] = len(faces) > 1
        movement_result["no_face"] = len(faces) == 0

        if len(faces) == 1:
            movement_result["face_detected"] = True
            landmarks = face_predictor(gray, faces[0])

            # Get key facial points
            nose_point = (landmarks.part(30).x, landmarks.part(30).y)
            left_cheek = landmarks.part(2).x
            right_cheek = landmarks.part(14).x

            # Current face position (nose point)
            current_position = nose_point

            # Check if we have previous positions to compare with
            if len(face_position_history) > 0:
                last_position = face_position_history[-1]

                # Calculate distance change
                distance = np.sqrt((current_position[0] - last_position[0])**2 +
                                 (current_position[1] - last_position[1])**2)

                # If significant movement detected
                if distance > 20:  # Threshold in pixels
                    movement_result["face_distance_change"] = True

            # Add current position to history
            face_position_history.append(current_position)

            # Check left/right movement
            cheek_threshold = 60
            if abs(nose_point[0] - left_cheek) > cheek_threshold:
                movement_result["left_movement"] = True
            if abs(nose_point[0] - right_cheek) > cheek_threshold:
                movement_result["right_movement"] = True

            # Eye gaze detection
            left_eye = ((landmarks.part(36).x + landmarks.part(39).x) // 2,
                        (landmarks.part(36).y + landmarks.part(39).y) // 2)
            right_eye = ((landmarks.part(42).x + landmarks.part(45).x) // 2,
                         (landmarks.part(42).y + landmarks.part(45).y) // 2)

            # Simple gaze estimation
            eye_center = (left_eye[0] + right_eye[0]) // 2
            gaze_threshold = 15
            if eye_center < nose_point[0] - gaze_threshold:
                movement_result["gaze_direction"] = "left"
            elif eye_center > nose_point[0] + gaze_threshold:
                movement_result["gaze_direction"] = "right"

    except Exception as e:
        logger.error(f"Facial analysis failed: {str(e)}")

    return movement_result

def detect_mouth_open(image):
    """Detect if mouth is open (potential speaking)"""
    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_detector(gray)

        if len(faces) == 1:
            landmarks = face_predictor(gray, faces[0])

            # Mouth points (outer lips)
            top_lip = landmarks.part(51).y
            bottom_lip = landmarks.part(57).y
            left_lip = landmarks.part(48).x
            right_lip = landmarks.part(54).x

            mouth_height = bottom_lip - top_lip
            mouth_width = right_lip - left_lip

            # Simple heuristic for mouth open
            if mouth_height > 0.3 * mouth_width:
                return True

    except Exception as e:
        logger.error(f"Mouth detection failed: {str(e)}")

    return False

def get_analysis(image_base64):
    """Main analysis function with frame rate control"""
    global last_processed_time

    current_time = time.time()
    if current_time - last_processed_time < processing_interval:
        logger.debug("Skipping frame due to processing interval")
        return None

    last_processed_time = current_time

    # Decode image
    image = decode_base64_image(image_base64)
    if image is None:
        return None

    # Initialize result structure
    result = {
        "suspicious_objects": {
            "mobile_phone": False,
            "person": False,
            "electronics": False,
            "book": False,
            "paper": False,
            "headphones": False
        },
        "facial_analysis": {
            "left_movement": False,
            "right_movement": False,
            "multiple_faces": False,
            "no_face": False,
            "face_distance_change": False,
            "gaze_direction": "center",
            "face_detected": False
        },
        "audio_analysis": {
            "mouth_open": False
        },
        "metadata": {
            "processing_time": current_time,
            "status": "success"
        }
    }

    try:
        # Object detection
        boxes, confidences, class_ids = detect_objects(image)
        suspicious_objects = detect_suspicious_objects(class_ids)
        result["suspicious_objects"].update(suspicious_objects)

        # Facial analysis
        movement = analyze_facial_movement(image)
        result["facial_analysis"].update(movement)

        # Mouth detection
        result["audio_analysis"]["mouth_open"] = detect_mouth_open(image)

    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        result["metadata"]["status"] = f"error: {str(e)}"

    return result

def refine_detection(result):
    """Add temporal consistency to detections"""
    if result is None:
        return None

    # Add current result to history
    movement_history.append(result["facial_analysis"])

    # If we have enough history, check for patterns
    if len(movement_history) == movement_history.maxlen:
        # Check for consistent left/right movement
        left_moves = sum(1 for m in movement_history if m["left_movement"])
        right_moves = sum(1 for m in movement_history if m["right_movement"])

        result["facial_analysis"]["consistent_left_movement"] = left_moves > 5
        result["facial_analysis"]["consistent_right_movement"] = right_moves > 5

    return result

def adjust_threshold(result):
    """Adjust detection thresholds dynamically"""
    if result is None:
        return None

    # Example: If we detect a person but no face, increase sensitivity
    if (result["suspicious_objects"]["person"] and
        not result["facial_analysis"]["face_detected"]):
        result["metadata"]["alert"] = "Person detected but no face visible"

    return result