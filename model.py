# ============================================================
# CinePredict - Machine Learning Model
# Target: Movie Gross Revenue
# ============================================================

import os
import warnings
import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    r2_score,
    mean_absolute_error,
    mean_squared_error,
    mean_squared_log_error
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor
from sklearn.linear_model import Ridge

warnings.filterwarnings("ignore")


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "movies.csv"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model.joblib"
)


# ============================================================
# FEATURES
# ============================================================

FEATURES = [
    "rating",
    "genre",
    "year",
    "score",
    "votes",
    "director",
    "writer",
    "star",
    "country",
    "budget",
    "company",
    "runtime"
]

TARGET = "gross"


# ============================================================
# LOAD DATASET
# ============================================================

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(
        f"Dataset not found:\n{DATA_PATH}\n\n"
        "Place your Kaggle movie CSV inside data/movies.csv"
    )

df = pd.read_csv(DATA_PATH)

print("=" * 60)
print("CinePredict - Dataset")
print("=" * 60)

print("Shape:", df.shape)

print("\nColumns:")
print(df.columns.tolist())


# ============================================================
# CHECK REQUIRED COLUMNS
# ============================================================

required_columns = FEATURES + [TARGET]

missing_columns = [
    col for col in required_columns
    if col not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Missing columns in dataset: {missing_columns}"
    )


# ============================================================
# CLEAN NUMERIC COLUMNS
# ============================================================

numeric_columns = [
    "year",
    "score",
    "votes",
    "budget",
    "runtime",
    "gross"
]

for col in numeric_columns:
    df[col] = pd.to_numeric(
        df[col],
        errors="coerce"
    )


# ============================================================
# REMOVE INVALID TARGET VALUES
# ============================================================

df = df.dropna(subset=["gross"])

df = df[df["gross"] > 0]


# ============================================================
# REMOVE EXTREME INVALID VALUES
# ============================================================

df = df[
    (df["budget"].isna()) |
    (df["budget"] >= 0)
]

df = df[
    (df["votes"].isna()) |
    (df["votes"] >= 0)
]

df = df[
    (df["runtime"].isna()) |
    (df["runtime"] > 0)
]

df = df[
    (df["score"].isna()) |
    ((df["score"] >= 0) & (df["score"] <= 10))
]


# ============================================================
# SELECT FEATURES
# ============================================================

X = df[FEATURES].copy()

y = df[TARGET].copy()


# ============================================================
# LOG TRANSFORMATION
# ============================================================
# Movie gross is highly skewed.
# log1p makes the target easier for the model to learn.

y_log = np.log1p(y)


# ============================================================
# COLUMN TYPES
# ============================================================

categorical_features = [
    "rating",
    "genre",
    "director",
    "writer",
    "star",
    "country",
    "company"
]

numeric_features = [
    "year",
    "score",
    "votes",
    "budget",
    "runtime"
]


# ============================================================
# PREPROCESSING
# ============================================================

numeric_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="median")
        )
    ]
)


categorical_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(
                strategy="most_frequent"
            )
        ),
        (
            "onehot",
            OneHotEncoder(
                handle_unknown="ignore"
            )
        )
    ]
)


preprocessor = ColumnTransformer(
    transformers=[
        (
            "numeric",
            numeric_pipeline,
            numeric_features
        ),
        (
            "categorical",
            categorical_pipeline,
            categorical_features
        )
    ]
)


# ============================================================
# TRAIN TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_log,
    test_size=0.20,
    random_state=42
)


# ============================================================
# MODELS
# ============================================================

models = {

    "Ridge Regression":
        Ridge(
            alpha=10.0
        ),

    "Random Forest":
        RandomForestRegressor(
            n_estimators=300,
            max_depth=18,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        ),

    "Extra Trees":
        ExtraTreesRegressor(
            n_estimators=300,
            max_depth=18,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
}


# ============================================================
# TRAIN & EVALUATE
# ============================================================

results = {}

best_model = None
best_score = -np.inf
best_model_name = None


for name, algorithm in models.items():

    print("\n" + "=" * 60)
    print(f"Training: {name}")
    print("=" * 60)

    pipeline = Pipeline(
        steps=[
            (
                "preprocessor",
                preprocessor
            ),
            (
                "model",
                algorithm
            )
        ]
    )

    pipeline.fit(
        X_train,
        y_train
    )

    predictions_log = pipeline.predict(
        X_test
    )

    # Convert prediction back from log scale
    predictions = np.expm1(
        predictions_log
    )

    actual = np.expm1(
        y_test
    )

    predictions = np.maximum(
        predictions,
        0
    )

    r2 = r2_score(
        actual,
        predictions
    )

    mae = mean_absolute_error(
        actual,
        predictions
    )

    rmse = np.sqrt(
        mean_squared_error(
            actual,
            predictions
        )
    )

    msle = mean_squared_log_error(
        actual,
        predictions
    )

    results[name] = {
        "r2": r2,
        "mae": mae,
        "rmse": rmse,
        "msle": msle
    }

    print(
        f"R2   : {r2:.4f}"
    )

    print(
        f"MAE  : ${mae:,.2f}"
    )

    print(
        f"RMSE : ${rmse:,.2f}"
    )

    print(
        f"MSLE : {msle:.4f}"
    )

    if r2 > best_score:

        best_score = r2

        best_model = pipeline

        best_model_name = name


# ============================================================
# SAVE MODEL
# ============================================================

model_package = {

    "model": best_model,

    "features": FEATURES,

    "target": TARGET,

    "model_name": best_model_name,

    "r2_score": best_score
}


joblib.dump(
    model_package,
    MODEL_PATH
)


# ============================================================
# FINAL OUTPUT
# ============================================================

print("\n" + "=" * 60)

print(
    f"BEST MODEL: {best_model_name}"
)

print(
    f"R2 SCORE: {best_score:.4f}"
)

print(
    f"Saved to: {MODEL_PATH}"
)

print("=" * 60)