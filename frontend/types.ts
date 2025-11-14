
export interface StudentData {
  studentId: string;
  name: string;
  course: string;
  hoursWatched: number;
  quizScores: number[]; // Array of scores from 0 to 100
  completed: boolean;
  dropoutWeek: number | null; // Week number if dropped out, else null
}
