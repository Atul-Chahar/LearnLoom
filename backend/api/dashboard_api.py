from flask import Blueprint, jsonify
from services.data_cleaning import load_cleaned_data

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.get("/dashboard-data")
def dashboard_data():
    """
    Provides all necessary data for the main dashboard view in a single call.
    """
    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"error": "No data available"}), 500

    # Calculate basic stats
    total_students = len(df)
    
    score_cols = ['math_score', 'reading_score', 'writing_score']
    existing_score_cols = [col for col in score_cols if col in df.columns]
    
    if not existing_score_cols:
        return jsonify({"error": "No score data available"}), 500

    df['overall_score'] = df[existing_score_cols].mean(axis=1)
    
    # Completion rate (overall_score >= 60)
    completed_students = df[df['overall_score'] >= 60]
    completion_rate = (len(completed_students) / total_students) * 100 if total_students > 0 else 0

    # Average score
    average_score = df['overall_score'].mean() if not df.empty else 0
    
    # Convert dataframe to list of dictionaries for JSON serialization
    # This will be used by the frontend to render charts and detailed student data
    student_data_list = df.to_dict(orient='records')

    return jsonify({
        "stats": {
            "totalStudents": total_students,
            "completionRate": round(completion_rate, 1),
            "averageScore": round(average_score, 1),
        },
        "studentData": student_data_list
    })
