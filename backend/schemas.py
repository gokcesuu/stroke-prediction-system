from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Any


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Predict ───────────────────────────────────────────────────────────────────

class StrokeInput(BaseModel):
    gender: str
    age: float
    hypertension: int
    heart_disease: int
    ever_married: str
    work_type: str
    Residence_type: str
    avg_glucose_level: float
    bmi: float
    smoking_status: str


# ── Predictions (history) ─────────────────────────────────────────────────────

class PredictionResponse(BaseModel):
    id: int
    user_id: int
    input_data: dict[str, Any]
    result_data: dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
