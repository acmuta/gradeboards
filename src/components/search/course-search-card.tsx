import React from "react";
import Link from "next/link"
import { Asterisk, ChevronRight, Flower2, Leaf, Sparkles, Star, StarHalf, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { titlecase, gpaToStars, nameToInitials } from "@/lib/utils";
import { SearchParams } from "@/types/grades";

interface CourseSearchCardProps {
  result: SearchParams;
}

export default function CourseSearchCard({ result }: CourseSearchCardProps) {
  const queryParams = new URLSearchParams();

  if (result.year && result.instructor !== "multiple instructors") queryParams.append("year", result.year.toString());
  if (result.semester && result.instructor !== "multiple instructors") queryParams.append("semester", result.semester);
  if (result.subjectId) queryParams.append("subjectId", result.subjectId);
  if (result.instructor && result.instructor !== "multiple instructors") queryParams.append("instructor", result.instructor);
  if (result.courseNumber)
    queryParams.append("courseNumber", result.courseNumber);
  if (result.sectionNumber)
    queryParams.append("sectionNumber", result.sectionNumber);

  const href = `/grades?${queryParams.toString().replace("+", " ")}`;

  return (
    <Link
      href={href}
      className="flex justify-center items-center w-full gap-1 bg-background border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="w-full p-2 flex flex-col justify-center items-between">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold leading-none inline-flex justify-center items-center">
            {result.subjectId?.toUpperCase()} {result.courseNumber}
            {result.instructor !== "multiple instructors" && (
              <span className="text-muted-foreground opacity-70">{`-${result.sectionNumber}`}</span>
            )}
          </span>
          <div className="text-xs text-muted-foreground border border-border font-medium inline-flex justify-center items-center gap-0.5 rounded pr-1 leading-none">
            <span className="leading-none bg-muted text-muted-foreground text-xs px-1 py-0.5 mr-0.5">
              {result.instructor === "multiple instructors" ? (
                <Asterisk className="fill-current text-blue-700" size={12} />
              ) : result.semester === "spring" ? (
                <Flower2 className="fill-current text-green-600" size={12} />
              ) : result.semester === "summer" ? (
                <Sun className="fill-current text-amber-500" size={12} />
              ) : (
                <Leaf className="fill-current text-yellow-900" size={12} />
              )}
            </span>
            {result.instructor === "multiple instructors" ? (
              "Multiple Terms"
            ) : (
              <span className="inline-flex justify-center items-center gap-0.5 leading-none">{`${titlecase(
                result.semester
              )} ${result.year}`}</span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs inline-flex gap-1 items-center">
            {result.instructor === "multiple instructors" ? (
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
          <div className="text-xs border border-border font-medium inline-flex justify-center items-center gap-0.5 rounded pr-1">
            <span className="leading-none bg-muted text-muted-foreground text-xs px-1 py-0.5 mr-0.5">
              Score
            </span>
            {Array.from({
              length: Math.floor(gpaToStars(result.gpa || 0)),
            }).map((_, index) =>
              index === 0 && gpaToStars(result.gpa || 0) >= 4 ? (
                <Sparkles
                  key={index}
                  size={12}
                  className="inline-block text-orange-400 fill-current"
                />
              ) : (
                <Star
                  key={index}
                  size={12}
                  className="inline-block text-orange-400 fill-current"
                />
              )
            )}
            {gpaToStars(result.gpa || 0) % 1 !== 0 &&
              gpaToStars(result.gpa || 0) !== 3.5 && (
                <div className="relative inline-block">
                  <Star size={12} className="text-zinc-300 fill-current" />
                  <StarHalf
                    size={12}
                    className="absolute top-0 left-0 text-orange-400 fill-current"
                  />
                </div>
              )}
            {Array.from({
              length: Math.floor(3 - gpaToStars(result.gpa || 0)),
            }).map((_, index) => (
              <Star
                key={index}
                size={12}
                className="inline-block text-zinc-300 fill-current"
              />
            ))}
          </div>
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
