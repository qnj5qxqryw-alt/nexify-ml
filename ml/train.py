import pandas as pd

# Load cleaned dataset
df = pd.read_csv("data/weather_clean.csv")

print("✅ Data loaded")
print(df.head())
print(df.info())

# Target variable
y = df["storm"]

# Features
X = df.drop(columns=["storm", "date"])

print("✅ Features & target prepared")
print("X shape:", X.shape)
print("y shape", y.shape)

# feature engineering
df["temp_humidity"] = df["temperature"] * df["humidity"]
df["wind_pressure"] = df["wind_speed"] / df["pressure"]
df["heavy_rain"] = (df["rain"] > 20).astype(int)

from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("✅Data split into train/test")

from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

model.fit(X_train, y_train)

print("🚀 Random Forest Model trained")

from sklearn.metrics import accuracy_score, classification_report

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("🎯Accuracy:", accuracy)
print("\n📊 Classification report:")
print(classification_report(y_test, y_pred))

import joblib
import os

os.makedirs("models", exist_ok=True)

joblib.dump(model, "models/weather_model.pkl")

print("✅Model.pkl saved to models/weather_model.pkl")