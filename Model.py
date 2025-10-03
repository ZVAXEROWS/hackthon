import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
import xgboost as xgb

# ==========================
# 1- Load dataset
# ==========================
df = pd.read_csv("data.csv")

# Replace -0999.0 with NaN
df.replace(-999.0, np.nan, inplace=True)
df.replace(-0999.0, np.nan, inplace=True)

# Drop rows where important values are missing
df.dropna(subset=["T2M_MAX", "T2M_MIN", "RH2M", "WS2M"], inplace=True)

# ==========================
# 2- Create Weather Status
# ==========================
def classify_weather(row):
    t = (row["T2M_MAX"] + row["T2M_MIN"]) / 2
    rh = row["RH2M"]
    ws = row["WS2M"]

    if pd.isna(t) or pd.isna(rh) or pd.isna(ws):
        return "unknown"

    if rh > 80 and t < 0:
        return "snowy"
    elif rh > 80 and t > 0:
        return "rainy"
    elif ws > 10 and rh < 50:
        return "dusty"
    elif t > 35:
        return "very hot"
    elif t > 25:
        return "hot"
    elif t > 15:
        return "warm"
    elif t > 5:
        return "cold"
    else:
        return "too cold"

df["WeatherStatus"] = df.apply(classify_weather, axis=1)

# Drop rows with unknown label
df = df[df["WeatherStatus"] != "unknown"]

# ==========================
# 3- Features & Target
# ==========================
X = df.drop(columns=["YEAR", "DOY", "WeatherStatus"])
y = df["WeatherStatus"]

# Encode target labels
encoder = LabelEncoder()
y = encoder.fit_transform(y)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ==========================
# 4- Models
# ==========================

# Random Forest
rf = RandomForestClassifier(n_estimators=200, random_state=42)
rf.fit(X_train, y_train)
y_pred_rf = rf.predict(X_test)

# XGBoost
xgb_model = xgb.XGBClassifier(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=6,
    random_state=42,
    tree_method="hist"   # أسرع للبيانات الكبيرة
)
xgb_model.fit(X_train, y_train)
y_pred_xgb = xgb_model.predict(X_test)

# SVM
svm_model = SVC(kernel="rbf", gamma="scale")
svm_model.fit(X_train, y_train)
y_pred_svm = svm_model.predict(X_test)

# ==========================
# 5- Results
# ==========================
print("=== Random Forest ===")
print("Accuracy:", accuracy_score(y_test, y_pred_rf))
print(classification_report(y_test, y_pred_rf, target_names=encoder.classes_))

print("\n=== XGBoost ===")
print("Accuracy:", accuracy_score(y_test, y_pred_xgb))
print(classification_report(y_test, y_pred_xgb, target_names=encoder.classes_))

print("\n=== SVM ===")
print("Accuracy:", accuracy_score(y_test, y_pred_svm))
print(classification_report(y_test, y_pred_svm, target_names=encoder.classes_))
