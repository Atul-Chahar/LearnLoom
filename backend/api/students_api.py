from flask import Blueprint, jsonify

students_bp = Blueprint("students", __name__)

@students_bp.get("/student/<student_id>/profile")
def student_profile(student_id):
    return jsonify({
        "student_id": student_id,
        "name": "",
        "average_score": 0,
        "hours_watched": 0,
        "progress": 0,
        "score_history": [],
        "activity_history": [],
        "last_active": "",
        "courses_enrolled": []
    })
