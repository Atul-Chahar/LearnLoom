import os
from kaggle.api.kaggle_api_extended import KaggleApi

RAW_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data", "raw")

def download_kaggle_dataset(dataset_name: str, file_name: str = None):
    """
    Downloads a Kaggle dataset into data/raw folder.
    Example dataset: "mlg-ulb/creditcardfraud"
    """

    # Make sure raw data directory exists
    os.makedirs(RAW_DATA_DIR, exist_ok=True)

    api = KaggleApi()
    api.authenticate()

    print(f"Downloading dataset: {dataset_name}")

    # Download dataset as zip file
    api.dataset_download_files(dataset_name, path=RAW_DATA_DIR, unzip=True)

    print("Download completed.")

    # If dataset contains a specific file we need
    if file_name:
        return os.path.join(RAW_DATA_DIR, file_name)

    return RAW_DATA_DIR
