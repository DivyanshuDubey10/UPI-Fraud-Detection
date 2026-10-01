import pandas as pd

from src.predict import predict_fraud


df = pd.read_csv("data/fraud_dataset.csv")

features = [
    "amount",
    "session_duration",
    "transaction_amount_vs_sender_history",
    "transaction_time_of_day",
    "input_timing_consistency",
    "keyboard_input_speed",
    "input_pause_patterns",
    "screen_active_time",
    "geographic_location_vs_ip",
    "background_data_usage",
    "pin_entry_speed",
    "request_amount_roundness"
]

sample = df[features].iloc[0].to_dict()

result = predict_fraud(sample)

print(result)
actual = int(df["is_fraud"].iloc[0])

print("Actual:", actual)
print("Predicted:", result["prediction"])
print("Correct:", actual == result["prediction"])