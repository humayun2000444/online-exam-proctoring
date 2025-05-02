
# 🎯 Online Exam Proctoring System

This project is an **Online Exam Proctoring** system that automatically monitors examinees using **YOLOv3 Object Detection**, **Facial Landmark Detection**, and **Screen Monitoring**.

---

## 📦 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/humayun2000444/online-exam-proctoring.git
cd online-exam-proctoring
```

---

## ⚙️ Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Create a Python virtual environment:

```bash
python -m venv myvenv
```

3. Activate the virtual environment:

- **On Windows:**

```bash
myvenv\Scripts\activate
```

- **On Mac/Linux:**

```bash
source myvenv/bin/activate
```

4. Install required Python packages:

```bash
pip install -r requirements.txt
```

---

## 📥 Download Required Models

- **YOLOv3 Weights**:  
  [Download YOLOv3 Weights](https://pjreddie.com/media/files/yolov3.weights)  
  *(Alternate Link: [Google Drive Link](https://drive.google.com/file/d/1BHnJwEdM_MtNIm6lBE7C3UuiFJ7v7fbl/view?usp=sharing))*

- **Facial Landmark Predictor**:  
  [Download shape_predictor_68_face_landmarks.dat](https://github.com/italojs/facial-landmarks-recognition/blob/master/shape_predictor_68_face_landmarks.dat?raw=true)

> **Important:**  
> After downloading, place both files inside the `/backend/models/` directory.

---

## 🛢️ Database Setup (MySQL)

1. Open the file:

```bash
backend/database/db.py
```

2. Edit your MySQL credentials:

```python
host = "localhost"
user = "root"
passwd = "password"
db = "exam_db"
```

(Replace `host`, `user`, `passwd`, and `db` with your own.)

3. Create the database and tables:

- Open `mysql/schema.sql`
- Execute the SQL queries in **MySQL Workbench** or any MySQL client.

---

## ▶️ Run the Backend Server

```bash
python app.py
```

This will start the backend server.

---

## 🌐 Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Start the frontend server:

```bash
npm start
```

The frontend will be available at `http://localhost:3000/`.

---

## 📁 Project Structure

```bash
online-exam-proctoring/
│
├── backend/
│   ├── app.py
│   ├── database/
│   ├── models/
│   └── requirements.txt
│
├── frontend/
│   ├── package.json
│   └── src/
│
├── mysql/
│   └── schema.sql
│
└── README.md
```

---

## 📞 Support

If you face any problems running this project, **feel free to contact me**.  
I'm happy to help you get it running!

---

# 🙌 Thank you for checking out this project!
