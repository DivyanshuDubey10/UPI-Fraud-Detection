from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.predict import predict_fraud


app = FastAPI(
    title="UPI Fraud Detection API",
    description="API for experimental UPI-style fraud risk prediction",
    version="1.0.0"
)


# Allow the React development server to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Transaction(BaseModel):
    amount: float
    session_duration: float
    transaction_amount_vs_sender_history: float
    transaction_time_of_day: float
    input_timing_consistency: float
    keyboard_input_speed: float
    input_pause_patterns: float
    screen_active_time: float
    geographic_location_vs_ip: float
    background_data_usage: float
    pin_entry_speed: float
    request_amount_roundness: float


@app.get("/")
def root():
    return {
        "message": "UPI Fraud Detection API is running"
    }


@app.post("/predict")
def predict(transaction: Transaction):
    transaction_data = transaction.model_dump()

    return predict_fraud(transaction_data)