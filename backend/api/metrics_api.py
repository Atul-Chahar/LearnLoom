from flask import Blueprint, jsonify
from services.data_cleaning import load_cleaned_data

metrics_bp = Blueprint("metrics", __name__)

# -----------------------------
#   AVERAGE SCORE
# -----------------------------
@metrics_bp.get("/average-score")
def average_score():
    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"average_score": 0})

    score_cols = ["math_score", "reading_score", "writing_score"]
    existing_cols = [c for c in score_cols if c in df.columns]

    if not existing_cols:
        return jsonify({"average_score": 0})

    df["overall_score"] = df[existing_cols].mean(axis=1)
    avg = df["overall_score"].mean()
    return jsonify({"average_score": round(float(avg), 2)})


# -----------------------------
#   COMPLETION RATE
# -----------------------------
@metrics_bp.get("/completion-rate")
def completion_rate():
    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"completion_rate": 0})

    score_cols = ["math_score", "reading_score", "writing_score"]
    existing_cols = [c for c in score_cols if c in df.columns]

    if not existing_cols:
        return jsonify({"completion_rate": 0})

    df["overall_score"] = df[existing_cols].mean(axis=1)

    # Students who scored >= 60 are “completed”
    completed = df[df["overall_score"] >= 60]
    rate = (len(completed) / len(df)) * 100

    return jsonify({"completion_rate": round(rate, 2)})


# -----------------------------
#   DROPOUT RATE
# -----------------------------
@metrics_bp.get("/dropout-rate")
def dropout_rate():
    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"dropout_rate": 0})

    score_cols = ["math_score", "reading_score", "writing_score"]
    existing_cols = [c for c in score_cols if c in df.columns]

    if not existing_cols:
        return jsonify({"dropout_rate": 0})

    df["overall_score"] = df[existing_cols].mean(axis=1)

    # Students scoring < 40 = “dropout”
    dropout = df[df["overall_score"] < 40]
    rate = (len(dropout) / len(df)) * 100

    return jsonify({"dropout_rate": round(rate, 2)})


# -----------------------------
#   TOTAL STUDENTS
# -----------------------------
@metrics_bp.get("/total-students")
def total_students():
    df = load_cleaned_data()
    return jsonify({"total_students": len(df) if df is not None and not df.empty else 0})


# -----------------------------
#   ACTIVE STUDENTS
# -----------------------------
@metrics_bp.get("/active-students")
def active_students():
    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"active_students": 0})

    score_cols = ["math_score", "reading_score", "writing_score"]
    existing_cols = [c for c in score_cols if c in df.columns]

    if not existing_cols:
        return jsonify({"active_students": 0})

    df["overall_score"] = df[existing_cols].mean(axis=1)

    # Active = in the middle range (between dropout and completion)
    active = df[(df["overall_score"] >= 40) & (df["overall_score"] < 60)]
    
    return jsonify({"active_students": len(active)})
