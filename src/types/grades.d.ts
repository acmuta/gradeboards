import { config_data } from "@/public/data/grade_config.js";

export interface UniversityConfig {
  university_id: string;
  university_name: string;
  university_short_name: string;
  university_logo: string[];
  university_address: string;
  university_phone: string;
  university_website: string;
  student_email_domain: string;
  primary_color: string;
  secondary_color: string;
}

export interface UniversityConfigs {
  [key: string]: UniversityConfig[];
}

export interface SearchParams {
  year: (typeof config_data.year)[string];
  semester: (typeof config_data.semester)[string];
  career: (typeof config_data.career)[string];
  instructor: (typeof config_data.instructor)[string];
  subjectId: (typeof config_data.subjectId)[string];
  courseNumber: (typeof config_data.courseNumber)[string];
  sectionNumber: (typeof config_data.sectionNumber)[string];
  sort: "year" | "semester" | "career" | "instructor" | "subjectId" | "courseNumber" | "sectionNumber" | "gpa";
  direction: "asc" | "desc";
  limit: number;
  gpa: number;
}

export interface GradeData {
  subjectId: string;
  courseNumber: string;
  sectionNumber: string;
  gradesCount: string;
  year: string;
  semester: string;
  career: string;
  instructor: string;
  gpa: string;
  dropPercent: string;
  grades_A: string;
  grades_B: string;
  grades_C: string;
  grades_D: string;
  grades_F: string;
  grades_I: string;
  grades_P: string;
  grades_Q: string;
  grades_W: string;
  grades_Z: string;
  grades_R: string;
}
