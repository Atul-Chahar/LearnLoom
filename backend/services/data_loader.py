import pandas as pd
import os
import ast

# Define the path to the cleaned data file
CLEANED_FILE_PATH = os.path.join(
    os.path.dirname(__file__), '..', '..', 'data', 'cleaned', 'cleaned_students.csv'
)

def load_student_data():
    """
    Loads cleaned student data from the CSV file.
    """
    try:
        df = pd.read_csv(CLEANED_FILE_PATH)
        # Ensure quizScores are treated as lists if they were saved as strings
        # This might need adjustment based on how quizScores are handled after cleaning
        # For now, assuming they are individual score columns or already processed
        return df
    except FileNotFoundError:
        print(f"Error: Cleaned data file not found at {CLEANED_FILE_PATH}")
        return pd.DataFrame() # Return empty dataframe if file not found
    except Exception as e:
        print(f"An error occurred while loading cleaned data: {e}")
        return pd.DataFrame()
