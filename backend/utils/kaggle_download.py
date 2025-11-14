import os
import kaggle
from zipfile import ZipFile

# Define the path where raw data will be stored
RAW_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw')
os.makedirs(RAW_DATA_DIR, exist_ok=True)

def download_kaggle_dataset(dataset_id: str):
    """
    Downloads a dataset from Kaggle and extracts it.

    Args:
        dataset_id (str): The dataset identifier from Kaggle (e.g., 'user/dataset-name').

    Returns:
        str: The path to the directory where files were extracted.
    """
    print(f"Downloading dataset: {dataset_id}...")
    try:
        # Authenticate and download the dataset
        kaggle.api.authenticate()
        kaggle.api.dataset_download_files(dataset_id, path=RAW_DATA_DIR, unzip=True)
        print(f"Dataset downloaded and extracted to {RAW_DATA_DIR}")
        return RAW_DATA_DIR
    except Exception as e:
        print(f"Error downloading dataset from Kaggle: {e}")
        print("Please ensure your kaggle.json API token is set up correctly.")
        return None