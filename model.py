import pandas as pd

# Load the data
df = pd.read_csv("features_monthly.csv")

def classify_weather(row):
    t_avg = (row["T2M_MAX"] + row["T2M_MIN"]) / 2   # متوسط الحرارة اليومية
    rh = row["RH2M"]   # الرطوبة
    ws = row["WS2M"]   # سرعة الرياح سطحية
    sw = row["ALLSKY_SFC_SW_DWN"]  # الإشعاع الشمسي
    ps = row["PS"]  # الضغط الجوي

    # --- Temperature conditions ---
    if t_avg >= 38:
        status = "very hot"
    elif 30 <= t_avg < 38:
        status = "hot"
    elif 20 <= t_avg < 30:
        status = "warm"
    elif 10 <= t_avg < 20:
        status = "cold"
    else:
        status = "too cold"

    # --- Additional weather conditions ---
    if rh > 80 and t_avg < 30:
        status = "rainy"
    if t_avg <= 5 and rh > 60:
        status = "snowy"
    if rh < 30 and ws > 6:
        status = "dusty"
    if ws > 12 and ps < 1005:  # رياح قوية + ضغط منخفض
        status = "stormy"
    if sw > 250 and t_avg > 28:
        status = "sunny"

    return status

# Apply classification
df["WeatherStatus"] = df.apply(classify_weather, axis=1)

# Show result
print(df[["date","T2M_MAX","T2M_MIN","RH2M","WS2M","ALLSKY_SFC_SW_DWN","PS","WeatherStatus"]].head(20))

print("\nSummary of weather predictions:")
print(df["WeatherStatus"].value_counts())

#train


from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Features
X = df[["T2MWET", "RH2M", "WS2M", "ALLSKY_SFC_SW_DWN", "PS"]]
y = df["WeatherStatus"]

# train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# model
model = RandomForestClassifier(n_estimators=10000, random_state=42)
model.fit(X_train, y_train)

# evaluation
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
