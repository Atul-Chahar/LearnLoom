from flask import Blueprint, jsonify
import pandas as pd
import os

trends_bp = Blueprint("trends", __name__)

CLEANED_DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "..",
    "data",
    "cleaned",
    "cleaned_students.csv"
)

def load_data():
    try:
        return pd.read_csv(CLEANED_DATA_PATH)
    except:
        return None

@trends_bp.get("/score-trend")
def score_trend():
    df = load_data()
    if df is None:
        return jsonify({"trend": []})

    score_cols = [c for c in df.columns if "score" in c]
    if not score_cols:
        return jsonify({"trend": []})

    df["avg_score"] = df[score_cols].mean(axis=1)

    num_weeks = 4
    chunk_size = len(df) // num_weeks if len(df) else 0
    trend = []

    for week in range(num_weeks):
        start = week * chunk_size
        end = start + chunk_size
        if week == num_weeks - 1:
            chunk = df.iloc[start:]
        else:
            chunk = df.iloc[start:end]
        avg = chunk["avg_score"].mean() if not chunk.empty else 0
        trend.append({
            "week": week + 1,
            "avg_score": round(float(avg), 2)
        })

    return jsonify({"trend": trend})

@trends_bp.get("/activity-trend")
def activity_trend():
    return jsonify({"dates": [], "activity": []})

@trends_bp.get("/weekly-progress")
def weekly_progress():
    return jsonify({"weeks": [], "average_scores": []})
