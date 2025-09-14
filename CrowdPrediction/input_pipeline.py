import pickle
import numpy as np
from datetime import datetime
import os
from data_converter import CrowdPredictionInputProcessor  

def main():
    model_path = os.path.join(os.path.dirname(__file__), "rkl_places_xgb.pkl")
    with open(model_path, "rb") as f:
        model = pickle.load(f)   

    processor = CrowdPredictionInputProcessor()

    place = "Hanuman Vatika"
    target_date = datetime(2025, 5, 30, 7, 0)

    feature_vector = processor.prepare_model_input(
        place_name=place,
        target_datetime=target_date,
        target_hour=18,
        weather_api_key="0203b89a4bf94e8ab5f220531252308"
    )

    X = np.array(feature_vector).reshape(1, -1)
    prediction = model.predict(X)

    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X)
        print("Prediction Probabilities:", proba)

    context = processor.get_prediction_context(
    place_name=place,
    target_datetime=target_date,
    target_hour=18,
    weather_api_key="0203b89a4bf94e8ab5f220531252308"
    )

    print("\n=== Prediction Result ===")
    print("Context:", context)
    print("Feature Vector:", feature_vector)
    print("Model Prediction:", prediction[0])

if __name__ == "__main__":
    main()
