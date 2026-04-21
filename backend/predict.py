import joblib
from pathlib import Path
import pandas as pd

# =========================================================
# PATH
# =========================================================
BASE_DIR = Path(__file__).resolve().parent.parent
from pathlib import Path
MODEL_PATH = Path(__file__).parent / "XGBoost_MBO.pkl"

model = joblib.load(MODEL_PATH)

# 🔥 EN İYİ THRESHOLD (TUNING SONUCU)
BEST_THRESHOLD = 0.65


# =========================================================
# PREDICT
# =========================================================
def predict_stroke_risk(input_data: dict):
    df = pd.DataFrame([input_data])

    # probability al
    prob = model.predict_proba(df)[0][1]

    # threshold ile karar ver
    prediction = 1 if prob >= BEST_THRESHOLD else 0

    # risk label
    if prediction == 1:
        risk_level = "Yüksek Risk"
    else:
        risk_level = "Düşük Risk"

    return {
        "probability": float(prob),
        "percentage": float(round(prob * 100, 2)),
        "threshold_used": BEST_THRESHOLD,
        "prediction": int(prediction),
        "risk_level": risk_level
    }


# =========================================================
# TEST
# =========================================================
if __name__ == "__main__":
    sample_data = {
        "gender": "Male",
        "age": 67,
        "hypertension": 1,
        "heart_disease": 1,
        "ever_married": "Yes",
        "work_type": "Private",
        "Residence_type": "Urban",
        "avg_glucose_level": 228.69,
        "bmi": 36.6,
        "smoking_status": "formerly smoked"
    }

    result = predict_stroke_risk(sample_data)
    print(result)