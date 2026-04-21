from fastapi import FastAPI
from pydantic import BaseModel
from predict import predict_stroke_risk

app = FastAPI(
    title="Stroke Prediction API",
    description="XGBoost + MBO optimized stroke risk prediction service",
    version="1.0.0"
)

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

@app.get("/")
def home():
    return {"message": "Stroke Prediction API is running"}

@app.post("/predict")
def predict(data: StrokeInput):
    result = predict_stroke_risk(data.dict())
    return result
