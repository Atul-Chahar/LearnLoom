
import { GoogleGenAI } from "@google/genai";
import { StudentData } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const getLearningInsights = async (studentData: StudentData[]): Promise<string> => {
  if (!apiKey) {
    return Promise.resolve(`
### Welcome to the AI Insights Dashboard!
This panel uses the Gemini API to analyze student data and provide actionable recommendations.

**To get started:**
*   It seems the Gemini API key is not configured.
*   Please create a \`.env\` file in the \`frontend\` directory and add your API key as \`VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE\`.
*   Once configured, this panel will automatically display a deep analysis of the student data shown in the charts.
    `);
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const studentDataSummary = studentData.map(s => ({
      studentId: s.studentId,
      hoursWatched: s.hoursWatched,
      averageScore: s.quizScores.reduce((a, b) => a + b, 0) / (s.quizScores.length || 1),
      completed: s.completed
  }));

  const studentsForPrediction = studentData.filter(s => !s.completed).slice(0, 3).map(s => s.studentId);

  const prompt = `
    You are an expert educational data analyst. Your task is to analyze the following JSON summary of student learning data and provide actionable insights for an educator.

    **Student Data Summary:**
    \`\`\`json
    ${JSON.stringify(studentDataSummary, null, 2)}
    \`\`\`

    **Your Tasks:**

    1.  **High-Level Summary:** Provide a brief, high-level summary of the dataset, mentioning the overall performance and engagement.

    2.  **Key Trend Analysis:**
        *   Analyze trends in course completion vs. dropout rates.
        *   Analyze the relationship between 'hoursWatched' (engagement) and 'averageScore' (performance).
        *   Identify any patterns that might indicate at-risk students.

    3.  **Actionable Recommendations:** Based on your analysis, provide 3-5 specific, actionable recommendations for an educator to improve student outcomes. Frame these as clear, concise bullet points.

    4.  **Predictive Analysis (Bonus):**
        *   For students with the following IDs: ${studentsForPrediction.join(', ')}.
        *   Predict their likelihood of course completion (High, Medium, Low).
        *   Briefly justify each prediction based on their data (hours watched, average score).

    **Output Format:**
    Please format your entire response in Markdown. Use headings (###) for each section and bullet points (*) for lists.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate insights from Gemini API.");
  }
};

export { getLearningInsights };
