import joblib
import pandas as pd
import sys

model = joblib.load("models/weather_model.pkl")

# Read input from command line (JSON string)
input_data = eval(sys.argv[1])

df = pd.DataFrame([input_data])

prediction = model.predict(df)[0]
probability = model.predict_proba(df)[0][1]

print({
    "storm": int(prediction),
    "confidence": float(probability)
})