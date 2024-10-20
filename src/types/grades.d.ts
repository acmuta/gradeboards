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

export interface UniversityConfigs {
  [key: string]: UniversityConfig[];
}