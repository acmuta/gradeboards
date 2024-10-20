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

export function titlecase(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function gpaToStars(gpa: number): number {
  return Math.round((gpa - 2) * 4) / 2;
}

export function nameToInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}
