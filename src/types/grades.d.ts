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