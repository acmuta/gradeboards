import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GradeResultsSkeleton from "./grade-results-skeleton";
import { useToast } from "@/hooks/use-toast";
import { GradeData } from "@/types/grades";

interface GradeResultsProps {
  gradeData: GradeData[];
}

export default function GradeResults({ gradeData }: GradeResultsProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (!gradeData) return;

    const sections = new Set();
    const hasDuplicates = gradeData.some((row) => {
      if (row.sectionNumber === '-1') return false;
      const key = `${row.subjectId}-${row.courseNumber}-${row.sectionNumber}`;
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
  }, []);

  if (!gradeData || gradeData.length === 0) {
    return <GradeResultsSkeleton />;
  }


  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Grade Distribution</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>GPA</TableHead>
            <TableHead>A</TableHead>
            <TableHead>B</TableHead>
            <TableHead>C</TableHead>
            <TableHead>D</TableHead>
            <TableHead>F</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gradeData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.subjectId}</TableCell>
              <TableCell>{row.courseNumber}</TableCell>
              <TableCell>{row.sectionNumber}</TableCell>
              <TableCell>{row.instructor}</TableCell>
              <TableCell>{parseFloat(row.gpa).toFixed(2)}</TableCell>
              <TableCell>{row.grades_A}</TableCell>
              <TableCell>{row.grades_B}</TableCell>
              <TableCell>{row.grades_C}</TableCell>
              <TableCell>{row.grades_D}</TableCell>
              <TableCell>{row.grades_F}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
