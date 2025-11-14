from flask import Blueprint, jsonify
from utils.kaggle_download import download_kaggle_dataset
from services.data_cleaning import clean_students_dataset
import pandas as pd
import os
from datetime import datetime

refresh_bp = Blueprint("refresh", __name__)

@refresh_bp.post("/refresh-data")
def refresh_data():

    # 1. Download dataset from Kaggle
    download_path = download_kaggle_dataset("spscientist/students-performance-in-exams")

    # 2. Clean the downloaded dataset
    df, cleaned_file_path = clean_students_dataset("StudentsPerformance.csv")

    # 3. Count rows from the dataframe
    row_count = len(df) if df is not None else 0

    # 4. Return response
    return jsonify({
        "status": "success",
        "rows_added": row_count,
        "cleaned_file": cleaned_file_path,
        "last_updated": datetime.now().isoformat()
    })
