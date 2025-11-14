import { StudentData } from '../types';

// This parser is designed for the "Online Education Data" from Kaggle.
// Assumed CSV structure: StudentID,CourseCategory,TimeSpentOnCourse,NumberOfQuizzesTaken,QuizScores,CompletionRate,...
// We will only use a subset of these columns.

export const parseStudentDataCSV = (csvString: string): Promise<StudentData[]> => {
  return new Promise((resolve, reject) => {
    try {
      const lines = csvString.trim().split('\n');
      if (lines.length < 2) {
        return reject(new Error("CSV file is empty or contains only a header."));
      }
      
      const header = lines[0].split(',').map(h => h.trim());
      const studentData: StudentData[] = [];

      // Find indices of required columns
      const studentIdIndex = header.indexOf('StudentID');
      const courseIndex = header.indexOf('CourseCategory');
      const hoursWatchedIndex = header.indexOf('TimeSpentOnCourse');
      const quizScoresIndex = header.indexOf('QuizScores');
      const completionRateIndex = header.indexOf('CompletionRate');

      const missingColumns = [];
      if (studentIdIndex === -1) missingColumns.push('StudentID');
      if (courseIndex === -1) missingColumns.push('CourseCategory');
      if (hoursWatchedIndex === -1) missingColumns.push('TimeSpentOnCourse');
      if (quizScoresIndex === -1) missingColumns.push('QuizScores');
      if (completionRateIndex === -1) missingColumns.push('CompletionRate');

      if (missingColumns.length > 0) {
        return reject(new Error(`CSV file is missing required columns: ${missingColumns.join(', ')}.`));
      }

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');

        if (values.length < header.length) continue; // Skip malformed rows

        const studentId = values[studentIdIndex].trim();
        const course = values[courseIndex].trim();
        const hoursWatched = parseFloat(values[hoursWatchedIndex]);
        const quizScore = parseFloat(values[quizScoresIndex]);
        const completionRate = parseFloat(values[completionRateIndex]);

        if (!studentId || isNaN(hoursWatched) || isNaN(quizScore) || isNaN(completionRate)) {
            continue; // Skip rows with invalid or missing data
        }

        studentData.push({
          studentId: studentId,
          name: `Student ${studentId}`, // Name not available in dataset, using ID
          course: course,
          hoursWatched: hoursWatched,
          quizScores: [quizScore], // Dataset has one score, putting it in an array
          completed: completionRate >= 90, // Define 'completed' as 90% or higher completion rate
          dropoutWeek: null, // Not available in this dataset
        });
      }
      resolve(studentData);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      reject(new Error("Failed to parse the CSV file. Please ensure it's a valid CSV format."));
    }
  });
};
