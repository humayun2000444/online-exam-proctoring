import cv2

def detect_multiple_faces():
    cam = cv2.VideoCapture(0)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    while True:
        ret, frame = cam.read()
        faces = face_cascade.detectMultiScale(frame, 1.1, 4)
        if len(faces) > 1:
            print("Multiple Faces Detected")
        cv2.imshow("Exam Monitoring", frame)
        if cv2.waitKey(1) == ord('q'):
            break

    cam.release()
    cv2.destroyAllWindows()
