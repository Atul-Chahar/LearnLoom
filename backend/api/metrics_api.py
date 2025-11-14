from flask import Blueprint, jsonify
import pandas as pd
import os

metrics_bp = Blueprint("metrics", __name__)

# Path to cleaned dataset
CLEANED_DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "..",
    "data",
    "cleaned",
    "cleaned_students.csv"
)

# -------------------------------
# REAL AVERAGE SCORE ENDPOINT
# -------------------------------
@metrics_bp.get("/average-score")
def average_score():
    try:
        # Load cleaned CSV
        df = pd.read_csv(CLEANED_DATA_PATH)

        # Find columns that contain "score"
        score_cols = [col for col in df.columns if "score" in col]

        if not score_cols:
            return jsonify({"average_score": None})

        # Mean of all score columns across all students
        avg = df[score_cols].mean(axis=1).mean()

        return jsonify({"average_score": round(float(avg), 2)})

    except Exception as e:
        return jsonify({"error": str(e), "average_score": None})


# -------------------------------
# PLACEHOLDER ENDPOINTS (to fill later)
# -------------------------------
@metrics_bp.get("/completion-rate")
def completion_rate():
    return jsonify({"completion_rate": 0})


@metrics_bp.get("/dropout-rate")
def dropout_rate():
    return jsonify({"dropout_rate": 0})


@metrics_bp.get("/total-students")
def total_students():
    try:
        df = pd.read_csv(CLEANED_DATA_PATH)
        return jsonify({"total_students": len(df)})
    except:
        return jsonify({"total_students": None})


@metrics_bp.get("/active-students")
def active_students():
    return jsonify({"active_students": 0})
