
import { StudentData } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Fetches AI-powered learning insights from the backend.
 * The backend will handle the call to the Gemini API.
 */
export const getLearningInsights = async (studentData: StudentData[]): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Backend responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error("Failed to fetch AI-powered insights from backend:", error);
    // Return a user-friendly error message
    return `### AI Insights Error\nFailed to get insights from the backend: ${error.message || error}`;
  }
};

