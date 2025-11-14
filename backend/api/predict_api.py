from flask import Blueprint, request, jsonify

predict_bp = Blueprint("predict", __name__)

@predict_bp.post("/predict")
def predict():
    data = request.json
    return jsonify({"completion_likelihood": 0})
