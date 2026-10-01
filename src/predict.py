import joblib
import pandas as pd

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "upi_fraud_model.joblib"


def load_model():
    return joblib.load(MODEL_PATH)


def predict_fraud(transaction_data):
    artifact = load_model()

    model = artifact["model"]
    features = artifact["features"]
    threshold = artifact["threshold"]

    # Convert input dictionary into a DataFrame
    transaction = pd.DataFrame([transaction_data])

    # Ensure the model receives the exact feature order
    transaction = transaction[features]

    probability = model.predict_proba(transaction)[0, 1]

    prediction = int(probability >= threshold)

    return {
        "fraud_probability": probability,
        "prediction": prediction,
        "result": "FRAUD" if prediction == 1 else "LEGITIMATE"
    }