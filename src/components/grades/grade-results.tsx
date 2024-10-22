import React, { useEffect } from "react";
import GradeResultsSkeleton from "./grade-results-skeleton";
import { useToast } from "@/hooks/use-toast";
import { GradeData } from "@/types/grades";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { gradeYearAbbreviation, titlecase } from "@/lib/utils";

interface GradeResultsProps {
  gradeData: GradeData[];
  percentages?: boolean;
}

export default function GradeResults({ gradeData, percentages = false }: GradeResultsProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (!gradeData) return;

    const sections = new Set();
    const hasDuplicates = gradeData.some((row) => {
      if (row.sectionNumber === "-1") return false;
      const key = `${row.subjectId}-${row.courseNumber}-${row.sectionNumber} ${row.semester} ${row.year}`;
      if (sections.has(key)) return true;
      sections.add(key);
      return false;
    });

    if (hasDuplicates) {
      toast({
        title: "Seeing Duplicate Data?",
        description:
          "Duplicate section numbers are likely intentionally assigned by the university.",
        duration: 60000,
      });
    }
  }, [gradeData, toast]);

  if (!gradeData || gradeData.length === 0) {
    return <GradeResultsSkeleton />;
  }

  const CourseKey = (row: GradeData) => {
    if (row.sectionNumber === "-1") return `${titlecase(row.instructor)}`;
    return `${gradeYearAbbreviation(row.semester, Number(row.year))} ${String(row.subjectId).toUpperCase()} ${String(row.courseNumber).toUpperCase()}-${String(row.sectionNumber).toUpperCase()}`;
  }

  const calculateTotal = (row: GradeData) => {
    return ["A", "B", "C", "D", "F", "W", "Q", "I", "P", "R", "Z"].reduce((total, grade) => 
      total + Number(row[`grades_${grade}` as keyof GradeData] || 0), 0
    );
  };

  const data = ["A", "B", "C", "D", "F", "Dropped", "Other"].map((grade) => ({
    name: grade,
    ...gradeData.reduce<Record<string, number>>((acc, row) => {
      const key = CourseKey(row);
      let value: number;
      const total = calculateTotal(row);

      if (grade === "Dropped") {
        value = Number(row.grades_W) + Number(row.grades_Q);
      } else if (grade === "Other") {
        value = Number(row.grades_I) + Number(row.grades_P) + Number(row.grades_R) + Number(row.grades_Z);
      } else {
        value = Number(row[`grades_${grade}` as keyof GradeData]) || 0;
      }

      acc[key] = percentages ? (value / total) * 100 : value;
      return acc;
    }, {}),
  }));

  return (
    <div>
      <BarChart width={730} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => percentages ? `${Math.round(Number(value))}%` : value} />
        <Legend />
        {gradeData.map((row, index) => (
          <Bar 
            key={CourseKey(row)}
            dataKey={CourseKey(row)} 
            fill={`hsl(${index * 360 / gradeData.length}, 70%, 70%)`} 
          />
        ))}
      </BarChart>
    </div>
  );
}
