import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface GradeResultsProps {
  fetchGrades: () => Promise<{ data: any[] }>;
}

export default async function GradeResults({ fetchGrades }: GradeResultsProps) {
  const { data } = await fetchGrades();

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
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.subjectId}</TableCell>
              <TableCell>{row.courseNumber}</TableCell>
              <TableCell>{row.sectionNumber}</TableCell>
              <TableCell>{row.instructor}</TableCell>
              <TableCell>{row.gpa.toFixed(2)}</TableCell>
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
