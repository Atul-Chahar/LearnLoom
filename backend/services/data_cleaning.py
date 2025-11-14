import os
import pandas as pd

RAW_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data", "raw")
CLEANED_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data", "cleaned")

def clean_students_dataset(file_name: str):
    """
    Cleans the raw Kaggle dataset and stores a cleaned version in data/cleaned.
    """

    raw_path = os.path.join(RAW_DATA_DIR, file_name)
    cleaned_path = os.path.join(CLEANED_DATA_DIR, "cleaned_students.csv")

    # Make sure cleaned dir exists
    os.makedirs(CLEANED_DATA_DIR, exist_ok=True)

    # Load raw CSV into Pandas dataframe
    df = pd.read_csv(raw_path)

    # Standardize column names (lowercase, underscores)
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace("-", "_")
    )

    # Remove duplicate rows
    df = df.drop_duplicates()

    # Remove fully empty rows
    df = df.dropna(how="all")

    # Fill missing numeric values with column mean
    numeric_cols = df.select_dtypes(include=["int64", "float64"]).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())

    # Fill missing text values with "Unknown"
    text_cols = df.select_dtypes(include=["object"]).columns
    df[text_cols] = df[text_cols].fillna("Unknown")

    # Save cleaned dataset
    df.to_csv(cleaned_path, index=False)

    return cleaned_path
