from flask import Blueprint, jsonify

courses_bp = Blueprint("courses", __name__)

@courses_bp.get("/course-analytics")
def course_analytics():
    return jsonify({"courses": []})

@courses_bp.get("/top-courses")
def top_courses():
    return jsonify({"top_courses": []})

@courses_bp.get("/hardest-courses")
def hardest_courses():
    return jsonify({"hardest_courses": []})
