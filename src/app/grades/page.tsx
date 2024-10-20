'use client';

import { useState, useEffect, Suspense } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { useSearchParams } from 'next/navigation';

interface GradeData {
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

async function fetchGrades(searchParams: URLSearchParams): Promise<GradeData[]> {
  const response = await fetch(`/api/grades?${searchParams.toString()}`);
  const data = await response.json();
  return data.data;
}

function GradeChart({ data }: { data: GradeData[] }) {
  const chartData = data.map(item => ({
    name: `${item.subjectId} ${item.courseNumber}`,
    A: parseInt(item.grades_A),
    B: parseInt(item.grades_B),
    C: parseInt(item.grades_C),
    D: parseInt(item.grades_D),
    F: parseInt(item.grades_F),
    I: parseInt(item.grades_I),
    P: parseInt(item.grades_P),
    Q: parseInt(item.grades_Q),
    W: parseInt(item.grades_W),
    Z: parseInt(item.grades_Z),
    R: parseInt(item.grades_R),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Legend />
        <Bar dataKey="A" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="B" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="C" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="D" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="F" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="I" fill="hsl(var(--chart-6))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="P" fill="hsl(var(--chart-7))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Q" fill="hsl(var(--chart-8))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="W" fill="hsl(var(--chart-9))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Z" fill="hsl(var(--chart-10))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="R" fill="hsl(var(--chart-11))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function GradeTable({ data }: { data: GradeData[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Instructor</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>Semester</TableHead>
          <TableHead>GPA</TableHead>
          <TableHead>Drop %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.subjectId}</TableCell>
            <TableCell>{item.courseNumber}</TableCell>
            <TableCell>{item.sectionNumber}</TableCell>
            <TableCell>{item.instructor}</TableCell>
            <TableCell>{item.year}</TableCell>
            <TableCell>{item.semester}</TableCell>
            <TableCell>{item.gpa}</TableCell>
            <TableCell>{item.dropPercent}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function GradesContent() {
  const [gradeData, setGradeData] = useState<GradeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGrades(searchParams);
        setGradeData(data);
      } catch (error) {
        console.error('Error fetching grade data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Grade Details</CardTitle>
        </CardHeader>
        <CardContent>
          <GradeTable data={gradeData} />
        </CardContent>
      </Card>
      <Suspense fallback={<div>Loading chart...</div>}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Grade Distribution Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <GradeChart data={gradeData} />
          </CardContent>
        </Card>
      </Suspense>
    </>
  );
}

export default function GradesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Grade Distribution</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <GradesContent />
      </Suspense>
    </div>
  );
}
