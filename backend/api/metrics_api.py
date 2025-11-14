from flask import Blueprint, jsonify

metrics_bp = Blueprint("metrics", __name__)

@metrics_bp.get("/average-score")
def average_score():
    return jsonify({"average_score": 0})

@metrics_bp.get("/completion-rate")
def completion_rate():
    return jsonify({"completion_rate": 0})

@metrics_bp.get("/dropout-rate")
def dropout_rate():
    return jsonify({"dropout_rate": 0})

@metrics_bp.get("/total-students")
def total_students():
    return jsonify({"total_students": 0})

@metrics_bp.get("/active-students")
def active_students():
    return jsonify({"active_students": 0})
