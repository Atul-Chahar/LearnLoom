from flask import Blueprint, jsonify, request
from services.data_cleaning import load_cleaned_data
import pandas as pd

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.get("/dashboard-data")
def dashboard_data():
    """
    Provides all necessary data for the main dashboard view in a single call,
    with optional date filtering.
    """
    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"error": "No data available"}), 500

    # Get date filters from query parameters
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')

    # Apply date filtering if parameters are provided
    if 'submission_date' in df.columns:
        df['submission_date'] = pd.to_datetime(df['submission_date'])
        if start_date_str:
            start_date = pd.to_datetime(start_date_str)
            df = df[df['submission_date'] >= start_date]
        if end_date_str:
            end_date = pd.to_datetime(end_date_str)
            df = df[df['submission_date'] <= end_date]
    else:
        # If submission_date column is missing, log a warning or handle as appropriate
        print("Warning: 'submission_date' column not found in data. Date filtering will not be applied.")


    # Recalculate stats after filtering
    total_students = len(df)
    
    score_cols = ['math_score', 'reading_score', 'writing_score']
    existing_score_cols = [col for col in score_cols if col in df.columns]
    
    if not existing_score_cols:
        # If no score data after filtering, return appropriate error or empty stats
        return jsonify({"stats": {"totalStudents": 0, "completionRate": 0, "averageScore": 0}, "studentData": []})

    df['overall_score'] = df[existing_score_cols].mean(axis=1)
    
    # Completion rate (overall_score >= 60)
    completed_students = df[df['overall_score'] >= 60]
    completion_rate = (len(completed_students) / total_students) * 100 if total_students > 0 else 0

    # Average score
    average_score = df['overall_score'].mean() if not df.empty else 0
    
    # Convert dataframe to list of dictionaries for JSON serialization
    student_data_list = df.to_dict(orient='records')

    return jsonify({
        "stats": {
            "totalStudents": total_students,
            "completionRate": round(completion_rate, 1),
            "averageScore": round(average_score, 1),
        },
        "studentData": student_data_list
    })
