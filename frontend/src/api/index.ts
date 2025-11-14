const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Fetches all the necessary data for the main dashboard from the backend,
 * with optional date filtering.
 */
export const getDashboardData = async (startDate?: string, endDate?: string) => {
  try {
    let url = `${API_BASE_URL}/dashboard-data`;
    const params = new URLSearchParams();

    if (startDate) {
      params.append('start_date', startDate);
    }
    if (endDate) {
      params.append('end_date', endDate);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
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
