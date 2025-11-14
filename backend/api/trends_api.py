from flask import Blueprint, jsonify
import pandas as pd
import os
from services.data_cleaning import load_cleaned_data # Import the centralized data loader

trends_bp = Blueprint("trends", __name__)

@trends_bp.get("/score-trend")
def score_trend():
    df = load_cleaned_data() # Use the centralized data loader
    if df is None or df.empty:
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
