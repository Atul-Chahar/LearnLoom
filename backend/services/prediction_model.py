import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
import os

from services.data_cleaning import load_cleaned_data, apply_filters

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'prediction_model.joblib')
PREPROCESSOR_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'preprocessor.joblib')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'model')

os.makedirs(MODEL_DIR, exist_ok=True)

# Global variable to hold the loaded model and preprocessor
_model_pipeline = None
_preprocessor = None

def train_and_save_model():
    """
    Trains the prediction model using the cleaned data and saves it.
    """
    print("Training and saving prediction model...")
    df = load_cleaned_data()
    if df is None or df.empty:
        print("No data available for model training.")
        return False

    score_cols = ['math_score', 'reading_score', 'writing_score']
    existing_score_cols = [col for col in score_cols if col in df.columns]
    if not existing_score_cols:
        print("No score data available for model training.")
        return False

    df['overall_score'] = df[existing_score_cols].mean(axis=1)
    df['completion'] = (df['overall_score'] >= 60).astype(int) # Target variable

    # Features to use for training
    features = df[['overall_score', 'test_preparation_course', 'parental_level_of_education', 'lunch', 'gender']]
    target = df['completion']

    # Preprocessing for categorical and numerical features
    categorical_features = ['test_preparation_course', 'parental_level_of_education', 'lunch', 'gender']
    numerical_features = ['overall_score']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='passthrough' # Keep other columns if any
    )

    # Create a pipeline with preprocessor and logistic regression model
    model_pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                                   ('classifier', LogisticRegression(solver='liblinear', random_state=42))])
    
    # Train the model
    model_pipeline.fit(features, target)

    # Save the trained model and preprocessor
    joblib.dump(model_pipeline, MODEL_PATH)
    joblib.dump(preprocessor, PREPROCESSOR_PATH) # Save preprocessor separately if needed for feature names etc.
    print("Prediction model trained and saved successfully.")
    return True

def load_model():
    """
    Loads the pre-trained prediction model and preprocessor.
    """
    global _model_pipeline, _preprocessor
    if _model_pipeline is None or _preprocessor is None:
        if os.path.exists(MODEL_PATH) and os.path.exists(PREPROCESSOR_PATH):
            print("Loading pre-trained prediction model...")
            _model_pipeline = joblib.load(MODEL_PATH)
            _preprocessor = joblib.load(PREPROCESSOR_PATH)
            print("Prediction model loaded successfully.")
        else:
            print("No pre-trained model found. Training a new one...")
            train_and_save_model()
            if os.path.exists(MODEL_PATH) and os.path.exists(PREPROCESSOR_PATH):
                _model_pipeline = joblib.load(MODEL_PATH)
                _preprocessor = joblib.load(PREPROCESSOR_PATH)
            else:
                print("Failed to train and load model.")
                _model_pipeline = None
                _preprocessor = None
    return _model_pipeline, _preprocessor

def get_trained_model_components():
    """
    Returns the globally loaded model pipeline and preprocessor.
    Ensures model is loaded if not already.
    """
    if _model_pipeline is None or _preprocessor is None:
        load_model()
    return _model_pipeline, _preprocessor

def predict_completion_likelihood(input_data):
    """
    Makes a prediction using the loaded model.
    input_data should be a dictionary matching expected features.
    """
    model_pipeline, preprocessor = get_trained_model_components()
    if model_pipeline is None:
        print("Prediction model not available.")
        return None

    # Create a DataFrame for the new input
    input_df = pd.DataFrame([input_data])

    # Ensure all expected categorical features are present in input_df for consistent preprocessing
    # This is crucial because OneHotEncoder needs to see all categories it was trained on.
    # We need to get the categories from the preprocessor.
    
    # For simplicity, let's assume the input_data already has the correct structure
    # or we handle missing categorical values by filling with mode from training data.
    # For now, we'll rely on handle_unknown='ignore' in OneHotEncoder.

    completion_likelihood = model_pipeline.predict_proba(input_df)[0][1]
    return completion_likelihood
