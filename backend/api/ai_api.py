from flask import Blueprint, jsonify, request
from services.ai_summary import generate_ai_summary
import pandas as pd

ai_bp = Blueprint("ai", __name__)

@ai_bp.post("/ai-summary")
def ai_summary():
    student_data_list = request.json.get('studentData', [])
    if not student_data_list:
        return jsonify({"error": "No student data provided"}), 400

    df = pd.DataFrame(student_data_list)

    # Ensure score columns are numeric
    score_cols = ['math_score', 'reading_score', 'writing_score']
    for col in score_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    df = df.dropna(subset=score_cols) # Drop rows where scores are not valid

    if df.empty:
        return jsonify({"error": "No valid student data after processing"}), 400

    df['overall_score'] = df[score_cols].mean(axis=1)

    # Calculate metrics
    total_students = len(df)
    completed_students = df[df['overall_score'] >= 60]
    completion_rate = (len(completed_students) / total_students) * 100 if total_students > 0 else 0
    average_score = df['overall_score'].mean() if not df.empty else 0
    
    dropout_students = df[df['overall_score'] < 40]
    dropout_rate = (len(dropout_students) / total_students) * 100 if total_students > 0 else 0

    active_students_count = df[(df['overall_score'] >= 40) & (df['overall_score'] < 60)].shape[0]


    metrics = {
        "average_score": round(float(average_score), 2),
        "completion_rate": round(completion_rate, 2),
        "dropout_rate": round(dropout_rate, 2),
        "active_students": active_students_count,
        "total_students": total_students,
    }

    # Generate a more robust trend for ai_summary.py
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
        avg = chunk["overall_score"].mean() if not chunk.empty else 0
        trend.append({
            "week": week + 1,
            "avg_score": round(float(avg), 2)
        })

    summary = generate_ai_summary(metrics, trend)

    return jsonify({
        "summary": summary,
        "metrics_used": metrics,
        "trend_used": trend
    })
