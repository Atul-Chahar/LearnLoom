const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Fetches all the necessary data for the main dashboard from the backend.
 */
export const getDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard-data`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // Re-throw the error to be handled by the calling component
    throw error;
  }
};
