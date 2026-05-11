from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from predict import predict_stroke_risk
import models
import schemas

router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.post("", response_model=schemas.PredictionResponse, status_code=201)
def create_prediction(
    body: schemas.StrokeInput,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    result = predict_stroke_risk(body.dict())

    prediction = models.Prediction(
        user_id=current_user.id,
        input_data=body.dict(),
        result_data=result,
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction


@router.get("/me", response_model=List[schemas.PredictionResponse])
def my_predictions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Prediction)
        .filter(models.Prediction.user_id == current_user.id)
        .order_by(models.Prediction.created_at.desc())
        .all()
    )
