
export interface StudentData {
  gender: string;
  ethnicity: string;
  parent_education: string;
  lunch_type: string;
  test_prep_course: string;
  math_score: number;
  reading_score: number;
  writing_score: number;
  overall_score?: number; // Added by backend, but optional for interface
}

export interface DashboardStats {
  totalStudents: number;
  completionRate: number;
  averageScore: number;
}
