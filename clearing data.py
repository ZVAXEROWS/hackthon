# تأكد إنك مثبت pandas, numpy
# pip install pandas numpy

import pandas as pd
import numpy as np

fname = "data.csv"   # غيّر لو اسم الملف مختلف

# 1) قراءه
df = pd.read_csv(fname)

# 2) نظف sentinels مثل -0999.0
sentinels = [-999.0, -0999.0, -9999.0, -999, -99.9, "-0999.0"]
df = df.replace(sentinels, np.nan)

# 3) melt الشهور
months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
long = df.melt(id_vars=["PARAMETER","YEAR","ANN"], value_vars=months,
               var_name="MONTH", value_name="VALUE")

# تعيين رقم الشهر وعمود التاريخ (نختار يوم 15 كتمثيل شهري)
month_map = {m:i for i,m in enumerate(months, start=1)}
long["MONTH_NUM"] = long["MONTH"].map(month_map)
long["YEAR"] = long["YEAR"].astype(int)
long["date"] = pd.to_datetime(dict(year=long["YEAR"], month=long["MONTH_NUM"], day=15))

# 4) pivot حتى نحصل على جدول واحد: كل تاريخ صف وكل PARAMETER عمود
pivot = long.pivot_table(index="date", columns="PARAMETER", values="VALUE", aggfunc="first")
pivot = pivot.sort_index()

# 5) سنوي (ANN) لو احتجت
ann = df[["PARAMETER","YEAR","ANN"]].pivot_table(index="YEAR", columns="PARAMETER", values="ANN", aggfunc="first")

# 6) أمثلة لمعالجة القيم المفقودة
# خيار بسيط: forward-fill ثم back-fill ثم interpolate
pivot_imp = pivot.fillna(method="ffill").fillna(method="bfill").interpolate(limit_direction="both")

# أو يمكنك استخدام SimpleImputer من sklearn مع strategy="mean" لكل عمود

# 7) فصل target (مثال: T2M)
target = "T2M"
if target in pivot_imp.columns:
    y = pivot_imp[target]
    X = pivot_imp.drop(columns=[target])
else:
    X = pivot_imp.copy()
    y = None

# 8) حفظ ملفات جاهزة للنمذجة
X.to_csv("features_monthly.csv")
if y is not None:
    y.to_csv("target_monthly.csv")
ann.to_csv("features_annual.csv")


