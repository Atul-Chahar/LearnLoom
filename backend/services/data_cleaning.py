import pandas as pd
import os

# Define paths for raw and cleaned data
RAW_DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'StudentsPerformance.csv')
CLEANED_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'cleaned')
CLEANED_FILE_PATH = os.path.join(CLEANED_DATA_DIR, 'cleaned_students.csv')

os.makedirs(CLEANED_DATA_DIR, exist_ok=True)

def clean_students_dataset(raw_file_name: str):
    """
    Cleans the 'StudentsPerformance.csv' dataset and saves it.
    - Renames columns for clarity
    - Standardizes categorical values
    """
    print("Starting data cleaning process...")
    try:
        df = pd.read_csv(os.path.join(os.path.dirname(RAW_DATA_PATH), raw_file_name))

        # Rename columns to be more programmatic
        df.rename(columns={
            'gender': 'gender',
            'race/ethnicity': 'ethnicity',
            'parental level of education': 'parent_education',
            'lunch': 'lunch_type',
            'test preparation course': 'test_prep_course',
            'math score': 'math_score',
            'reading score': 'reading_score',
            'writing score': 'writing_score'
        }, inplace=True)

        # Save the cleaned file
        df.to_csv(CLEANED_FILE_PATH, index=False)
        print(f"Data cleaned successfully. Cleaned file saved to: {CLEANED_FILE_PATH}")
        return CLEANED_FILE_PATH

    except FileNotFoundError:
        print(f"Error: Raw data file '{raw_file_name}' not found at {RAW_DATA_PATH}")
        return None
    except Exception as e:
        print(f"An error occurred during data cleaning: {e}")
        return None