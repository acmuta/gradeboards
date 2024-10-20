"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseSearchCard from "@/components/search/course-search-card";
import { ChevronDown, Search } from "lucide-react";
import { universityConfig, titlecase } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import { config_data as APIParams } from "@/../public/data/grade_config.js";
import { SearchParams } from "@/types/grades";
import { useToast } from "@/hooks/use-toast";
import { usePlaceholderAnimation } from "@/hooks/usePlaceholderAnimation";

// const CourseSearchCard = React.lazy(() => import('@/components/search/course-search-card'));

export default function Searchbar(): JSX.Element {
  const [selectedTab, setSelectedTab] = useState<string>("grades");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchParams, setSearchParams] = useState<SearchParams>();
  const [searchResults, setSearchResults] = useState<SearchParams[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialSearch, setIsInitialSearch] = useState<boolean>(true);
  const placeholderText = usePlaceholderAnimation();
  const { toast } = useToast();
  const uni = universityConfig();

  const debouncedSetSearchInput = useMemo(
    () =>
      debounce((value: string) => {
        setSearchInput(value);
      }, 300),
    []
  );

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (searchParams?.subjectId)
      queryParams.append("subjectId", searchParams.subjectId);
    if (searchParams?.year) queryParams.append("year", searchParams.year);
    if (searchParams?.semester)
      queryParams.append("semester", searchParams.semester);
    if (searchParams?.career) queryParams.append("career", searchParams.career);
    if (searchParams?.instructor)
      queryParams.append("instructor", searchParams.instructor);
    if (searchParams?.courseNumber)
      queryParams.append("courseNumber", searchParams.courseNumber);
    if (searchParams?.sectionNumber)
      queryParams.append("sectionNumber", searchParams.sectionNumber);
    if (searchParams?.gpa)
      queryParams.append("gpa", searchParams.gpa.toString());

    if (queryParams.toString()) {
      if (isInitialSearch) {
        setIsLoading(true);
      }
      fetch(`/api/grades?${queryParams.toString()}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setSearchResults(data.data);
          setIsInitialSearch(false);
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            description: "Failed to fetch search results. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [searchParams, isInitialSearch, toast]);

  const processSearchInput = useMemo(() => {
    return (input: string): SearchParams => {
      const tokens = input
        .trim()
        .replace(/[^a-zA-Z0-9\s-\.]/g, "")
        .split(/\s+/);
      const result: SearchParams = {
        year: undefined,
        semester: undefined,
        instructor: undefined,
        subjectId: undefined,
        courseNumber: undefined,
        sectionNumber: undefined,
        career: "ugrd",
        sort: "year",
        direction: "desc",
        limit: 50,
        gpa: 0,
      };

      const filledFields = new Set<keyof SearchParams>(["career"]);
      const fullInputMatch = input.match(
        /([a-z]{2,4}[-]{0,1}[a-z]{0,2})([-\.\s]*\d{1,4})(?:[-\.\s]+([a-z]{1,2}\d{1,2}|\d{1,3})(?!\d))?/gi
      );

      if (fullInputMatch) {
        for (const match of fullInputMatch) {
          const [, rawSubject, rawCourse, rawSection] =
            match.match(
              /([a-z]{2,4}[-]{0,1}[a-z]{0,2})([-\.\s]*\d{1,4})(?:[-\.\s]+([a-z]{1,2}\d{1,2}|\d{1,3})(?!\d))?/i
            ) || [];
          const subjectId = rawSubject
            ?.trim()
            .toLowerCase()
            .replace(/[\s\.-]/g, "");
          const courseNumber = rawCourse
            ?.trim()
            .toLowerCase()
            .replace(/[\s\.-]/g, "");
          const sectionNumber = rawSection
            ?.trim()
            .toLowerCase()
            .replace(/[\s\.-]/g, "");

          if (
            subjectId &&
            !APIParams.semester.includes(subjectId) &&
            APIParams.subjectId.includes(subjectId)
          ) {
            result.subjectId = subjectId;
            filledFields.add("subjectId");
          }
          if (courseNumber && !APIParams.year.includes(courseNumber)) {
            result.courseNumber = courseNumber;
            filledFields.add("courseNumber");
          }
          if (
            sectionNumber &&
            APIParams.sectionNumber.includes(sectionNumber)
          ) {
            result.sectionNumber = sectionNumber;
            filledFields.add("sectionNumber");
          }
        }
      }

      for (const token of tokens) {
        if (!filledFields.has("year") && APIParams.year.includes(token)) {
          result.year = token;
          filledFields.add("year");
        } else if (
          !filledFields.has("semester") &&
          APIParams.semester.includes(token.toLowerCase())
        ) {
          result.semester = token.toLowerCase();
          filledFields.add("semester");
        } else {
          const lowerToken = token.toLowerCase();
          if (
            [
              "undergrad",
              "ug",
              "bs",
              "ba",
              "bba",
              "bfa",
              "baas",
              "btech",
              "bm",
              "bset",
              "bas",
              "bsc",
              "beng",
              "bed",
              "bcom",
              "bacc",
              "bns",
              "bachelor",
              "bachelors",
            ].includes(lowerToken)
          ) {
            // ugrd is already default :)
          } else if (
            [
              "grad",
              "graduate",
              "master",
              "masters",
              "phd",
              "mba",
              "ma",
              "mphil",
              "msc",
              "md",
              "dds",
              "jd",
              "mpa",
              "mm",
              "mdiv",
              "dpt",
            ].includes(lowerToken)
          ) {
            result.career = "grad";
          } else if (!filledFields.has("instructor")) {
            const cleanToken = lowerToken
              .replace(/[^a-z-]/g, "")
              .replace(/^(dr|prof|professor|sir|ms|mr|mrs)?\s*/i, "")
              .replace(/-$/, "");

            if (!Object.values(result).includes(cleanToken)) {
              const adjacentTokens = tokens
                .slice(tokens.indexOf(token) + 1)
                .join(" ")
                .toLowerCase();
              const cleanAdjacentTokens = adjacentTokens
                .replace(/[^a-z-\s]/g, "")
                .replace(/^(dr|prof|professor|sir|ms|mr|mrs)?\s*/i, "")
                .replace(/-$/, "");
              let instructorTokens = cleanAdjacentTokens
                ? `${cleanToken} ${cleanAdjacentTokens}`.trim()
                : cleanToken;

              if (instructorTokens) {
                const instructorTokensArray = instructorTokens.split(" ");
                const firstToken = instructorTokensArray[0];
                const lastToken =
                  instructorTokensArray[instructorTokensArray.length - 1];

                if (APIParams.subjectId.includes(firstToken)) {
                  result.subjectId = firstToken;
                  instructorTokens = instructorTokensArray.slice(1).join(" ");
                  filledFields.add("subjectId");
                } else if (APIParams.semester.includes(firstToken)) {
                  result.semester = firstToken;
                  instructorTokens = instructorTokensArray.slice(1).join(" ");
                  filledFields.add("semester");
                }

                if (APIParams.subjectId.includes(lastToken)) {
                  result.subjectId = lastToken;
                  instructorTokens = instructorTokensArray
                    .slice(0, -1)
                    .join(" ");
                  filledFields.add("subjectId");
                } else if (APIParams.semester.includes(lastToken)) {
                  result.semester = lastToken;
                  instructorTokens = instructorTokensArray
                    .slice(0, -1)
                    .join(" ");
                  filledFields.add("semester");
                }

                result.instructor = instructorTokens;
                filledFields.add("instructor");
              }
            }
          }
        }
      }

      return result;
    };
  }, []);

  useEffect(() => {
    setSearchParams(processSearchInput(searchInput));
  }, [searchInput, processSearchInput]);

  return (
    <div
      className={`w-full max-w-[40rem] flex flex-col justify-center items-center mt-16 md:mt-0 ${
        isHovered || searchInput ? "shadow-lg" : ""
      } transition-shadow duration-200 rounded-lg`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="text-5xl font-bold mb-8 md:hidden"
        style={{ color: uni.primary_color }}
      >
        {uni.university_short_name} <span className="font-normal">Grades</span>
      </span>

      <Tabs
        defaultValue="grades"
        className={`w-full flex justify-center items-center gap-1.5 p-1.5 border rounded-lg bg-secondary ${
          searchInput ? "rounded-b-none" : ""
        }`}
        onValueChange={(val) => setSelectedTab(val)}
      >
        <Popover
          onOpenChange={(open) => {
            setIsPopoverOpen(open);
            setIsHovered(open);
          }}
        >
          <PopoverTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="outline"
                className="w-28 inline-flex justify-between items-center"
              >
                {titlecase(selectedTab)}
                <motion.div
                  animate={{ rotate: isPopoverOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown />
                </motion.div>
              </Button>
            </motion.div>
          </PopoverTrigger>
          <PopoverContent className="w-80" sideOffset={1}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grades">Grades</TabsTrigger>
                <TabsTrigger value="reviews" disabled>
                  {/*!TODO: remove disabled when this product is shipped :) */}
                  Reviews
                  <Badge className="px-2 ml-2">WIP</Badge>
                </TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTab}
                  initial={{ opacity: 0, x: selectedTab === "grades" ? 5 : -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: selectedTab === "grades" ? 5 : -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent
                    value="grades"
                    className="flex flex-col gap-2 justify-center items-center mt-0"
                  >
                    <Image
                      src="https://placehold.co/320x180.png"
                      width={320}
                      height={180}
                      alt="Grades Preview"
                      className="mt-2"
                      priority
                      loading="eager"
                    />
                    <CardDescription className="w-full text-base">
                      Explore course grade distributions and professor ratings
                      with our popular search tool.
                    </CardDescription>
                  </TabsContent>
                  <TabsContent
                    value="reviews"
                    className="flex flex-col gap-2 justify-center items-center mt-0"
                  >
                    <Image
                      src="https://placehold.co/320x180.png"
                      width={320}
                      height={180}
                      alt="Reviews Preview"
                      className="mt-2"
                      priority
                      loading="eager"
                    />
                    <CardDescription className="w-full text-base">
                      Find authentic student reviews and contribute your own on
                      professors and courses.
                    </CardDescription>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </PopoverContent>
        </Popover>

        <TabsContent
          value="grades"
          className={`mt-0 ${
            selectedTab === "grades" ? "flex w-full" : "hidden"
          } items-center justify-center relative`}
        >
          <Input
            type="text"
            placeholder={
              isInitialSearch && isLoading
                ? "Loading Grades..."
                : placeholderText
            }
            className="rounded-r-none focus-visible:ring-transparent"
            onChange={(e) => {
              debouncedSetSearchInput(e.target.value);
            }}
            disabled={isInitialSearch && isLoading}
          />
          {/* TODO old code to auto highlight text as you type :D worked well, but was too laggy on weak devices. Might revisit later */}
          {/* <div className="absolute inset-0 pointer-events-none flex items-center">
            <div className="pl-3 text-sm text-muted-foreground ml-[1px]">
              {searchInput && (
                <span>
                  {searchInputAnnotated.split(/(?<=\S)(?=[A-Z])|\s+/).map((word, index, array) => {
                    let color = 'text-muted-foreground';
                    const combinedInput = array.join(' ');
                    const subjectCoursePattern = /([a-z]{2,4})[-\s\.]*(\d{4})(?:[-\s\.]*((?:[a-z]{1,2}\d{1,2}|\d{1,3})))?/i;
                    const yearSemesterPattern = /(\d{4})\s*(fall|spring|summer)|((fall|spring|summer)\s*\d{4})/i;

                    if ((searchParams?.year && word === searchParams.year) ||
                        (searchParams?.semester && word.toLowerCase() === searchParams.semester)) {
                      color = 'text-green-500';
                    } else if (searchParams?.instructor && searchParams.instructor.toLowerCase().includes(word.toLowerCase())) {
                      color = 'text-yellow-500';
                    } else {
                      const match = combinedInput.match(subjectCoursePattern);
                      const yearSemesterMatch = combinedInput.match(yearSemesterPattern);
                      
                      if (match) {
                        const [fullMatch, subject, course, section] = match;
                        const normalizedWord = word.toLowerCase().replace(/[\s\.-]/g, '');
                        const normalizedSubject = subject.toLowerCase().replace(/[\s\.-]/g, '');
                        const normalizedCourse = course.toLowerCase().replace(/[\s\.-]/g, '');
                        const normalizedSection = section ? section.toLowerCase().replace(/[\s\.-]/g, '') : '';
                        const normalizedFullMatch = fullMatch.toLowerCase().replace(/[\s\.-]/g, '');

                        if (
                          (searchParams?.subject && normalizedWord === normalizedSubject) ||
                          (searchParams?.course && normalizedWord === normalizedCourse) ||
                          (searchParams?.section && normalizedWord === normalizedSection) ||
                          (searchParams?.subject && searchParams?.course && normalizedFullMatch.startsWith(normalizedWord)) ||
                          (searchParams?.course && searchParams?.section && normalizedFullMatch.endsWith(normalizedWord)) ||
                          (searchParams?.subject && searchParams?.course && searchParams?.section && normalizedFullMatch.includes(normalizedWord))
                        ) {
                          color = 'text-blue-500';
                        }
                      }
                      
                      // Check if the current word is part of a year-semester combo
                      if (yearSemesterMatch) {
                        const [fullMatch, year1, semester1, , semester2, year2] = yearSemesterMatch;
                        const year = year1 || year2;
                        const semester = semester1 || semester2;
                        if (word === year || word.toLowerCase() === semester.toLowerCase()) {
                          color = 'text-green-500';
                        }
                      }
                    }
                    return <span key={index} className={color}>{word}{' '}</span>;
                  })}
                </span>
              )}
            </div>
          </div> */}
          <Button
            size="icon"
            className="rounded-l-none border border-border border-l-0"
            disabled={isInitialSearch && isLoading}
          >
            <Search size={16} />
          </Button>
        </TabsContent>
        <TabsContent
          value="reviews"
          className={`mt-0 ${
            selectedTab === "reviews" ? "flex w-full" : "hidden"
          } items-center justify-center`}
        >
          <Input
            type="text"
            placeholder="Search Reviews" //!TODO: animate dynamically (animate through different examples)
            className="rounded-r-none focus-visible:ring-transparent"
            onChange={(e) => debouncedSetSearchInput(e.target.value)}
            disabled={isInitialSearch && isLoading}
          />
          <Button
            size="icon"
            className="rounded-l-none border border-border border-l-0"
            disabled={isInitialSearch && isLoading}
          >
            <Search size={16} />
          </Button>
        </TabsContent>
      </Tabs>
      {searchInput && (
        <div
          className={`w-full max-w-[40rem] bg-secondary gap-1.5 p-1.5 border rounded-lg flex justify-center items-stretch max-h-[60vh] md:max-h-96 h-full ${
            searchInput ? "rounded-t-none border-t-0" : ""
          }`}
        >
          <div className="w-28 flex-shrink-0 bg-card rounded-md border flex flex-col justify-start items-center gap-1 p-1">
            <span className="text-xs leading-4">Search Filters</span>
            <Separator className="w-full" />
            {(searchParams?.semester || searchParams?.year) && (
              <div className="flex flex-col justify-center items-center">
                <span className="text-xs text-muted-foreground leading-4">
                  School Term
                </span>
                <span className="text-xs font-bold leading-4">{`${
                  searchParams?.semester
                    ? titlecase(searchParams?.semester) + " "
                    : ""
                }${searchParams?.year ? searchParams?.year : ""}`}</span>
              </div>
            )}
            {(searchParams?.subjectId ||
              searchParams?.courseNumber ||
              searchParams?.sectionNumber) && (
              <div className="flex flex-col justify-center items-center">
                <span className="text-xs text-muted-foreground leading-4">
                  Course
                </span>
                <span className="text-xs font-bold leading-4">{`${
                  searchParams?.subjectId
                    ? String(searchParams?.subjectId).toUpperCase()
                    : ""
                }${
                  searchParams?.courseNumber
                    ? " " + searchParams?.courseNumber
                    : ""
                }${
                  searchParams?.sectionNumber
                    ? "-" + String(searchParams?.sectionNumber).toUpperCase()
                    : ""
                }`}</span>
              </div>
            )}
            {searchParams?.instructor && (
              <div className="flex flex-col justify-center items-center">
                <span className="text-xs text-muted-foreground leading-4">
                  Instructor
                </span>
                <span className="text-xs font-bold leading-4">{`${
                  searchParams?.instructor
                    ? titlecase(searchParams?.instructor)
                    : ""
                }`}</span>
              </div>
            )}
            {searchParams?.career && (
              <div className="flex flex-col justify-center items-center">
                <span className="text-xs text-muted-foreground leading-4">
                  Degree Type
                </span>
                <span className="text-xs font-bold leading-4">{`${
                  searchParams?.career
                    ? searchParams?.career === "ugrd"
                      ? "Undergrad"
                      : "Graduate"
                    : ""
                }`}</span>
              </div>
            )}
          </div>
          <div className="flex-grow bg-card rounded-md border flex flex-col justify-start items-center gap-1 p-1 max-h-[60vh] md:max-h-96 overflow-y-auto">
            {isInitialSearch && isLoading ? (
              <span className="text-xs text-muted-foreground h-24 flex justify-center items-center">
                Performing initial search...
              </span>
            ) : (
              <>
                {searchResults &&
                  searchResults.map((result, index) => (
                    <React.Suspense
                      key={index}
                      fallback={<div>Loading...</div>}
                    >
                      <CourseSearchCard result={result} />
                    </React.Suspense>
                  ))}
                {searchResults.length ? (
                  searchResults.length >= 50 ? (
                    <span className="text-xs text-muted-foreground opacity-50">
                      {"- only first 50 results shown -"}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground opacity-50">
                      {"- end of search results -"}
                    </span>
                  )
                ) : (
                  <span className="text-xs text-muted-foreground h-24 flex justify-center items-center">
                    No results found
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
