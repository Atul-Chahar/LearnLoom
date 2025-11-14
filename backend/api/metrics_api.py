from flask import Blueprint, jsonify
import pandas as pd
import os

metrics_bp = Blueprint("metrics", __name__)

# Cleaned data path
CLEANED_DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "..",
    "data",
    "cleaned",
    "cleaned_students.csv"
)

def load_data():
    """Helper to load cleaned dataset safely."""
    try:
        df = pd.read_csv(CLEANED_DATA_PATH)
        return df
    except:
        return None


# ------------------------------
# 1. AVERAGE SCORE  (DONE)
# ------------------------------
@metrics_bp.get("/average-score")
def average_score():
    df = load_data()
    if df is None:
        return jsonify({"average_score": None})

    score_cols = [c for c in df.columns if "score" in c]

    if not score_cols:
        return jsonify({"average_score": None})

    avg = df[score_cols].mean(axis=1).mean()
    return jsonify({"average_score": round(float(avg), 2)})


# ------------------------------
# 2. COMPLETION RATE
# ------------------------------
@metrics_bp.get("/completion-rate")
def completion_rate():
    df = load_data()
    if df is None:
        return jsonify({"completion_rate": None})

    score_cols = [c for c in df.columns if "score" in c]
    df["avg_score"] = df[score_cols].mean(axis=1)

    completed = df[df["avg_score"] >= 60]
    rate = (len(completed) / len(df)) * 100

    return jsonify({"completion_rate": round(rate, 2)})


# ------------------------------
# 3. DROPOUT RATE
# ------------------------------
@metrics_bp.get("/dropout-rate")
def dropout_rate():
    df = load_data()
    if df is None:
        return jsonify({"dropout_rate": None})

    score_cols = [c for c in df.columns if "score" in c]
    df["avg_score"] = df[score_cols].mean(axis=1)

    dropout = df[df["avg_score"] <= 40]
    rate = (len(dropout) / len(df)) * 100

    return jsonify({"dropout_rate": round(rate, 2)})


# ------------------------------
# 4. TOTAL STUDENTS (DONE)
# ------------------------------
@metrics_bp.get("/total-students")
def total_students():
    df = load_data()
    if df is None:
        return jsonify({"total_students": None})

    return jsonify({"total_students": len(df)})


# ------------------------------
# 5. ACTIVE STUDENTS
# ------------------------------
@metrics_bp.get("/active-students")
def active_students():
    df = load_data()
    if df is None:
        return jsonify({"active_students": None})

    score_cols = [c for c in df.columns if "score" in c]
    df["avg_score"] = df[score_cols].mean(axis=1)

    active = df[(df["avg_score"] > 40) & (df["avg_score"] < 60)]

    return jsonify({"active_students": len(active)})


# ------------------------------
# 6. SCORE TREND (4 WEEKS)
# ------------------------------
@metrics_bp.get("/score-trend")
def score_trend():
    df = load_data()
    if df is None:
        return jsonify({"trend": []})
    
    # Find score columns & compute avg_score
    score_cols = [c for c in df.columns if "score" in c]
    df["avg_score"] = df[score_cols].mean(axis=1)

    # Number of weeks (4 chunks)
    num_weeks = 4

    # Split dataset into equal chunks
    chunk_size = len(df) // num_weeks
    trend = []

    for week in range(num_weeks):
        start = week * chunk_size
        end = start + chunk_size

        # Last chunk must include remaining rows
        if week == num_weeks - 1:
            chunk = df.iloc[start:]
        else:
            chunk = df.iloc[start:end]

        avg = chunk["avg_score"].mean()
        trend.append({
            "week": week + 1,
            "avg_score": round(float(avg), 2)
        })

    return jsonify({"trend": trend})
