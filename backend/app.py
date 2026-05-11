from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models
from routers import auth_router, users, predictions

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Stroke Prediction API",
    description="XGBoost + MBO optimized stroke risk prediction service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(users.router)
app.include_router(predictions.router)


@app.get("/")
def home():
    return {"message": "Stroke Prediction API is running"}
