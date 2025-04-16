import cv2
import base64
import numpy as np
import dlib

# Globals
net = None
classes = []
layer_names = []
output_layers = []

def yolov3_model_v3_path(weight_path, cfg_path, names_path):
    global net, classes, layer_names, output_layers
    net = cv2.dnn.readNet(weight_path, cfg_path)

    with open(names_path, "r") as f:
        classes.clear()
        classes.extend([line.strip() for line in f.readlines()])

    layer_names = net.getLayerNames()
    try:
        output_layers_ids = net.getUnconnectedOutLayers()
        if isinstance(output_layers_ids[0], list) or len(output_layers_ids.shape) > 1:
            output_layers = [layer_names[i[0] - 1] for i in output_layers_ids]
        else:
            output_layers = [layer_names[i - 1] for i in output_layers_ids]
    except Exception as e:
        print("Error extracting output layers:", str(e))
        output_layers = []

def decode_base64_image(base64_string):
    img_data = base64.b64decode(base64_string)
    np_array = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(np_array, cv2.IMREAD_COLOR)

def get_analysis(image_base64, shape_predictor_path):
    image = decode_base64_image(image_base64)
    height, width, _ = image.shape

    # YOLO object detection
    blob = cv2.dnn.blobFromImage(image, scalefactor=1/255, size=(416, 416), swapRB=True, crop=False)
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
            if confidence > 0.4:
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    results = {
        "mob_status": False,
        "person_status": False,
        "user_move1": False,
        "user_move2": False
    }

    for i, class_id in enumerate(class_ids):
        label = classes[class_id].lower()
        if label in ["cell phone", "mobile phone", "phone"]:
            results["mob_status"] = True
        elif label == "person":
            results["person_status"] = True

    # Face movement detection using Dlib
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(shape_predictor_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)

    if len(faces) == 1:
        landmarks = predictor(gray, faces[0])
        nose_point = landmarks.part(30).x
        left_cheek = landmarks.part(2).x
        right_cheek = landmarks.part(14).x

        if abs(nose_point - left_cheek) > 60:
            results["user_move1"] = True
        if abs(nose_point - right_cheek) > 60:
            results["user_move2"] = True

    return results

def refine_detection(result):
    # Custom logic if needed for refining
    return result

def adjust_threshold(result):
    # Logic to tune detection confidence threshold dynamically if needed
    return result
