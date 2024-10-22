import React from "react";
import Link from "next/link"
import { Asterisk, ChevronRight, Flower2, Leaf, Sparkles, Star, StarHalf, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { titlecase, nameToInitials } from "@/lib/utils";
import { SearchParams } from "@/types/grades";
import StarCard from "@/components/grades/star-card";
import SplitBadge from "@/components/grades/split-badge";

interface CourseSearchCardProps {
  result: SearchParams;
}

export default function CourseSearchCard({ result }: CourseSearchCardProps) {
  const queryParams = new URLSearchParams();

  if (result.year && result.semester?.toLowerCase() !== "multiple terms") queryParams.append("year", result.year.toString());
  if (result.semester && result.semester?.toLowerCase() !== "multiple terms") queryParams.append("semester", result.semester);
  if (result.subjectId) queryParams.append("subjectId", result.subjectId);
  if (result.instructor && result.instructor?.toLowerCase() !== "multiple instructors") queryParams.append("instructor", result.instructor);
  if (result.courseNumber)
    queryParams.append("courseNumber", result.courseNumber);
  if (result.sectionNumber && result.sectionNumber !== "-1")
    queryParams.append("sectionNumber", result.sectionNumber);

  const href = `/grades?${queryParams.toString().replace(/\+/g, " ")}`;

  return (
    <Link
      href={href}
      className="flex justify-center items-center w-full gap-1 bg-background border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="w-full p-2 flex flex-col justify-center items-between">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold leading-none inline-flex justify-center items-center">
            {result.subjectId?.toUpperCase()}
            {result.courseNumber && ` ${result.courseNumber}`}
            {result.sectionNumber !== "-1" && result.semester?.toLowerCase() !== "multiple terms" && (
              <span className="text-muted-foreground opacity-70">{`-${result.sectionNumber}`}</span>
            )}
          </span>
          <SplitBadge
            leftContent={
              result.semester?.toLowerCase() === "multiple terms" ? (
                <Asterisk className="fill-current text-blue-700" size={12} />
              ) : result.semester === "spring" ? (
                <Flower2 className="fill-current text-green-600" size={12} />
              ) : result.semester === "summer" ? (
                <Sun className="fill-current text-amber-500" size={12} />
              ) : (
                <Leaf className="fill-current text-yellow-900" size={12} />
              )
            }
            className="text-xs text-muted-foreground"
          >
            {result.semester?.toLowerCase() === "multiple terms"
              ? "Multiple Terms"
              : result.semester && result.year
              ? `${titlecase(result.semester)} ${result.year}`
              : result.semester || ""}
          </SplitBadge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs inline-flex gap-1 items-center">
            {result.instructor?.toLowerCase() === "multiple instructors" ? (
              <div className="flex -space-x-3.5">
                <Avatar className="text-[0.5rem] w-5 h-5 border shadow border-border">
                  <AvatarFallback />
                </Avatar>
                <Avatar className="text-[0.5rem] w-5 h-5 border shadow border-border">
                  <AvatarFallback />
                </Avatar>
                <Avatar className="text-[0.5rem] w-5 h-5 border shadow border-border">
                  <AvatarFallback>{"🤠"}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <Avatar className="text-[0.5rem] w-5 h-5 border shadow border-border">
                <AvatarFallback>
                  {nameToInitials(result.instructor.toUpperCase())}
                </AvatarFallback>
              </Avatar>
            )}
            {titlecase(result.instructor)}
          </span>
          <StarCard gpa={result.gpa} />
          <span className="hidden">{`For the sleuths trying to find the course GPA, here you go: (${Number(
            result.gpa
          ).toFixed(2)})`}</span>
        </div>
      </div>
      <span className="h-full w-8 flex justify-center items-center bg-muted">
        <ChevronRight size={24} className="text-muted-foreground" />
      </span>
    </Link>
  );
}
