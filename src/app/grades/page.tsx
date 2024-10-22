"use client";

import { ChevronDown, Pencil, Briefcase, Star, Users, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import GradeResultsSkeleton from "@/components/grades/grade-results-skeleton";
import GradeResults from "@/components/grades/grade-results";
import { GradeData } from "@/types/grades";
import { useEffect, useState } from "react";
import Searchbar from "@/components/search/searchbar";
import { titlecase } from "@/lib/utils";
import StarCard from "@/components/grades/star-card";
import StudentCard from "@/components/grades/student-card";

async function fetchGrades(
  searchParams: URLSearchParams
): Promise<GradeData[]> {
  const response = await fetch(`/api/grades?${searchParams.toString()}`);
  const data = await response.json();
  return data.data;
}

export default function GradeDistribution() {
  const [gradeData, setGradeData] = useState<GradeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [utagradeScore] = useState(2.5);
  const [studentCount] = useState(65);
  const [courseOpen, setCourseOpen] = useState(false);
  const [professorOpen, setProfessorOpen] = useState(false);
  const [semesterOpen, setSemesterOpen] = useState(false);

  const { toast } = useToast();
  const searchParams = useSearchParams();

  const courses = gradeData.map((item, index) => ({
    id: index,
    name: `${item.subjectId} ${item.courseNumber}`,
    code: `${item.subjectId} ${item.courseNumber}-${item.sectionNumber}`,
  }));

  const professors = gradeData.map((item, index) => ({
    id: index,
    name: item.instructor,
    title: "Professor",
    avatar: "/placeholder.svg?height=32&width=32",
  }));

  const semesters = [
    { id: 1, name: "Spring 2023" },
    { id: 2, name: "Fall 2022" },
    { id: 3, name: "Summer 2022" },
  ];

  const [selectedCourse, setSelectedCourse] = useState(courses[0] || null);
  const [selectedProfessor, setSelectedProfessor] = useState(professors[0] || null);
  const [selectedSemester, setSelectedSemester] = useState(semesters[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGrades(searchParams);
        if (!data || data.length === 0) {
          throw new Error("No grade data available");
        }
        setGradeData(data);
      } catch (error) {
        console.error("Error fetching grade data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch grade data. Please try again later, or contact acm.uta@gmail.com if the issue persists.",
          variant: "destructive",
        });
        
        setGradeData([
          {
            subjectId: "Error",
            courseNumber: "Error",
            sectionNumber: "Error",
            gradesCount: "Error",
            year: "Error",
            semester: "Error",
            career: "Error",
            instructor: "Error",
            gpa: "0",
            dropPercent: "0",
            grades_A: "0",
            grades_B: "0",
            grades_C: "0",
            grades_D: "0",
            grades_F: "0",
            grades_I: "0",
            grades_P: "0",
            grades_Q: "0",
            grades_W: "0",
            grades_Z: "0",
            grades_R: "0",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams, toast]);

  if (isLoading) {
    return <GradeResultsSkeleton />;
  }

  const prepopulatedSearch = `${searchParams.get("semester") ? titlecase(String(searchParams.get("semester"))) || "" : ""} ${searchParams.get("year") || ""} ${searchParams.get("subjectId") ? searchParams.get("subjectId")?.toUpperCase() || "" : ""} ${searchParams.get("courseNumber") || ""}${searchParams.get("sectionNumber") ? `-${searchParams.get("sectionNumber")?.toUpperCase()}` : ""} ${searchParams.get("instructor") ? titlecase(String(searchParams.get("instructor"))) || "" : ""}`.trim();

  return (
    <Card className="w-full ">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Popover open={courseOpen} onOpenChange={setCourseOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={courseOpen} className="w-[300px] justify-between">
                <div>
                  <div className="font-bold">{selectedCourse?.name || "Select a course"}</div>
                  <div className="text-sm text-muted-foreground">{selectedCourse?.code || ""}</div>
                </div>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search courses..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No course found.</CommandEmpty>
                  <CommandGroup>
                    {courses.map((course) => (
                      <CommandItem
                        key={course.id}
                        onSelect={() => {
                          setSelectedCourse(course);
                          setCourseOpen(false);
                        }}
                      >
                        {course.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Searchbar 
            productToggle={false} 
            placeholder={prepopulatedSearch} 
            popover={true} 
            searchButton={false} 
            defaultValue={prepopulatedSearch}
          />
        </div>

        <div className="flex items-center justify-between">
          <Popover open={professorOpen} onOpenChange={setProfessorOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={professorOpen} className="w-[300px] justify-start">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={selectedProfessor?.avatar || "/placeholder.svg?height=32&width=32"} alt={selectedProfessor?.name || "Professor"} />
                  <AvatarFallback>{selectedProfessor?.name?.split(" ").map(n => n[0]).join("") || "P"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{selectedProfessor?.name || "Select a professor"}</span>
                  <span className="text-xs text-muted-foreground">{selectedProfessor?.title || ""}</span>
                </div>
                <div className="ml-auto flex space-x-1">
                  <Badge variant="secondary" className="h-5 w-5 rounded-full p-0">
                    <Pencil className="h-3 w-3" />
                  </Badge>
                  <Badge variant="secondary" className="h-5 w-5 rounded-full p-0">
                    <Briefcase className="h-3 w-3" />
                  </Badge>
                  <Badge variant="secondary" className="h-5 w-5 rounded-full p-0">
                    <ChevronDown className="h-3 w-3" />
                  </Badge>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search professors..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No professor found.</CommandEmpty>
                  <CommandGroup>
                    {professors.map((professor) => (
                      <CommandItem
                        key={professor.id}
                        onSelect={() => {
                          setSelectedProfessor(professor);
                          setProfessorOpen(false);
                        }}
                      >
                        {professor.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex items-center space-x-4">
            <StarCard gpa={utagradeScore} size="lg" />
            <StudentCard studentCount={studentCount} />
            <Popover open={semesterOpen} onOpenChange={setSemesterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={semesterOpen} className="w-[150px] justify-between">
                  <Sun className="h-4 w-4 mr-2" />
                  {selectedSemester.name}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[150px] p-0">
                <Command>
                  <CommandInput placeholder="Select semester..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No semester found.</CommandEmpty>
                    <CommandGroup>
                      {semesters.map((semester) => (
                        <CommandItem
                          key={semester.id}
                          onSelect={() => {
                            setSelectedSemester(semester);
                            setSemesterOpen(false);
                          }}
                        >
                          {semester.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-6 h-[400px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
          <GradeResults gradeData={gradeData} />
        </div>
      </CardContent>
    </Card>
  );
}
