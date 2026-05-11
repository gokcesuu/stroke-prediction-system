import joblib
import pandas as pd
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "XGBoost_MBO.pkl"
model = joblib.load(MODEL_PATH)

BEST_THRESHOLD = 0.65


def predict_stroke_risk(input_data: dict) -> dict:
    df = pd.DataFrame([input_data])
    prob = model.predict_proba(df)[0][1]
    prediction = 1 if prob >= BEST_THRESHOLD else 0
    risk_level = "Yüksek Risk" if prediction == 1 else "Düşük Risk"

    return {
        "probability": float(prob),
        "percentage": float(round(prob * 100, 2)),
        "threshold_used": BEST_THRESHOLD,
        "prediction": int(prediction),
        "risk_level": risk_level,
    }


if __name__ == "__main__":
    sample = {
        "gender": "Male", "age": 67, "hypertension": 1, "heart_disease": 1,
        "ever_married": "Yes", "work_type": "Private", "Residence_type": "Urban",
        "avg_glucose_level": 228.69, "bmi": 36.6, "smoking_status": "formerly smoked",
    }
    print(predict_stroke_risk(sample))
