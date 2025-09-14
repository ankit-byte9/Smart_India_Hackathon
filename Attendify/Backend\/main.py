from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import uvicorn
import os
import shutil

from auth import create_access_token, get_current_admin_user, get_current_teacher_user, authenticate_user
from database import get_db, engine, Base
from models import Admin, Teacher, Student, AttendanceRecord, AttendanceSession
from crud import create_teacher, create_student
from schemas import Token, TeacherCreate, StudentCreate
from face_recognition_service import FaceRecognitionService

app = FastAPI(title="Secure Attendance API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the face recognition service
face_service = FaceRecognitionService()

# Create database tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Secure Attendance API is running"}

# Admin Login Endpoint
@app.post("/admin/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password, "admin")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username, "role": "admin"})
    return {"access_token": access_token, "token_type": "bearer"}

# Teacher Login Endpoint
@app.post("/teacher/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password, "teacher")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username, "role": "teacher"})
    return {"access_token": access_token, "token_type": "bearer"}

# Secure Admin Endpoint for Teacher Registration
@app.post("/admin/register_teacher", response_model=Teacher)
def register_teacher(teacher: TeacherCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin_user)):
    db_teacher = create_teacher(db, teacher)
    return db_teacher

# Secure Admin Endpoint for Student Registration
@app.post("/admin/register_student", response_model=Student)
async def register_student(
    name: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin_user)
):
    # Save the image file
    image_folder = os.path.join("students", name)
    os.makedirs(image_folder, exist_ok=True)
    file_path = os.path.join(image_folder, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_student = create_student(db, name, file_path)
    return db_student

# Train model endpoint
@app.post("/train")
def train_model(current_user: Admin = Depends(get_current_admin_user)):
    face_service.train_model(students_folder="students")
    return {"message": "Model training started"}

# Face Recognition Upload Endpoint
@app.post("/upload")
async def upload_image(file: UploadFile = File(...), current_user: Teacher = Depends(get_current_teacher_user)):
    try:
        image_data = await file.read()
        results = face_service.recognize_faces(image_data)
        return {"recognized_faces": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)