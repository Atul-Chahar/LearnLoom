from flask import Blueprint, jsonify
from services.data_loader import load_student_data

metrics_bp = Blueprint("metrics", __name__)

@metrics_bp.get("/average-score")
def average_score():
    df = load_student_data()
    if df.empty:
        return jsonify({"average_score": 0})
    
    # Assuming 'math_score', 'reading_score', 'writing_score' are present after cleaning
    score_cols = ['math_score', 'reading_score', 'writing_score']
    
    # Filter for existing score columns
    existing_score_cols = [col for col in score_cols if col in df.columns]
    
    if not existing_score_cols:
        return jsonify({"average_score": 0})

    df['overall_score'] = df[existing_score_cols].mean(axis=1)
    avg = df['overall_score'].mean()
    return jsonify({"average_score": round(float(avg), 2)})

@metrics_bp.get("/completion-rate")
def completion_rate():
    df = load_student_data()
    if df.empty:
        return jsonify({"completion_rate": 0})
    
    # Assuming 'overall_score' or similar metric determines completion
    # For this dataset, let's define completion as overall score >= 60
    score_cols = ['math_score', 'reading_score', 'writing_score']
    existing_score_cols = [col for col in score_cols if col in df.columns]
    
    if not existing_score_cols:
        return jsonify({"completion_rate": 0})

    df['overall_score'] = df[existing_score_cols].mean(axis=1)
    completed_students = df[df['overall_score'] >= 60]
    rate = (len(completed_students) / len(df)) * 100
    return jsonify({"completion_rate": round(rate, 2)})

@metrics_bp.get("/dropout-rate")
def dropout_rate():
    df = load_student_data()
    if df.empty:
        return jsonify({"dropout_rate": 0})
    
    # Assuming 'overall_score' or similar metric determines dropout
    # For this dataset, let's define dropout as overall score < 40
    score_cols = ['math_score', 'reading_score', 'writing_score']
    existing_score_cols = [col for col in score_cols if col in df.columns]
    
    if not existing_score_cols:
        return jsonify({"dropout_rate": 0})

    df['overall_score'] = df[existing_score_cols].mean(axis=1)
    dropout_students = df[df['overall_score'] < 40]
    rate = (len(dropout_students) / len(df)) * 100
    return jsonify({"dropout_rate": round(rate, 2)})

@metrics_bp.get("/total-students")
def total_students():
    df = load_student_data()
    count = len(df) if not df.empty else 0
    return jsonify({"total_students": count})

@metrics_bp.get("/active-students")
def active_students():
    df = load_data()
    if df is None:
        return jsonify({"active_students": None})

    score_cols = [c for c in df.columns if "score" in c]
    df["avg_score"] = df[score_cols].mean(axis=1)

    active = df[(df["avg_score"] > 40) & (df["avg_score"] < 60)]

    return jsonify({"active_students": len(active)})



