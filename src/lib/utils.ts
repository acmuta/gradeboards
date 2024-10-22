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
  return Math.max(Math.round((gpa - 1.975) * 4) / 2, 0);
}

export function nameToInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}

export function classSize(size: number): string {
  if (size >= 200) return "XXXL";
  if (size >= 150) return "XXL";
  if (size >= 100) return "XL";
  if (size >= 60) return "Large";
  if (size >= 30) return "Medium";
  if (size >= 20) return "Small";
  if (size >= 10) return "XS";
  if (size >= 5) return "XXS";
  return "XXXS";
}
