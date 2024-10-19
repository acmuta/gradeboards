import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import universityConfigs from "@/../university_configs.json"
import { UniversityConfig } from "@/types/grades";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function universityConfig() {
  return universityConfigs[universityConfigs["__ENABLED_UNIVERSITY"] as keyof typeof universityConfigs] as UniversityConfig;
}
