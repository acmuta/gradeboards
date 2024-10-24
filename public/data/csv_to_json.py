import os
import csv
import json

# Copyright (c) 2024 Ryan Lahlou
# This script reads all CSV files in the current directory and cleans + combines them into a single JSON file.

def get_current_directory():
  with open(f"{current_directory}/university_configs.json", "r") as file:
    data = json.load(file)
    enabled_university = data["__ENABLED_UNIVERSITY"]
    if enabled_university in data:
      return data[enabled_university].get("university_id", None)
    else:
      raise ValueError(f"Enabled university '{enabled_university}' not found in university_configs.json")
      

def csv_to_combined_json(directory):
  total_data = []
  unique_years = set()
  unique_semesters = set()
  unique_careers = set()
  unique_instructors = set()
  unique_subjectIds = set()
  unique_courseNumbers = set()
  unique_sectionNumbers = set()
  unique_gpas = set()
  unique_courses = set()
  unique_terms = set()
  course_prof_mapping = {}
    
  for filename in os.listdir(directory):
    if filename.endswith(".csv"):
      file_path = os.path.join(directory, filename)
      combined_data = []
      
      with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
          try:
            row["subjectId"] = row.pop("Subject").lower()
          except KeyError:
            print("Warning: Subject not found")
          
          try: 
            row["courseNumber"] = row.pop("Catalog Number").lower()
          except KeyError:
            print("Warning: Catalog Number not found")
            
          try:
            row["sectionNumber"] = row.pop("Section Number").lower()
          except KeyError:
            print("Warning: Section Number not found")
          
          # add row R, and set to 0, if it doesn't exist
          try:
            if "R" not in row:
              row["R"] = 0
          except KeyError:
            print("Error: R couldn't be added")
          
          try:
            row["grades"] = {"A": row["A"], "B": row["B"], "C": row["C"], "D": row["D"], "F": row["F"], "I": row["I"], "P": row["P"], "Q": row["Q"], "W": row["W"], "Z": row["Z"], "R": row["R"]}
            row.pop("A")
            row.pop("B")
            row.pop("C")
            row.pop("D")
            row.pop("F")
            row.pop("I")
            row.pop("P")
            row.pop("Q")
            row.pop("W")
            row.pop("Z")
            row.pop("R")
          except KeyError:
            print("Warning: Grades not found")
            
          try: 
            row["gradesCount"] = row.pop("Total Grades")
          except KeyError:
            print("Warning: Total Grades not found")
            
          try:
            row["year"] = row["Term"].split(" ")[0]
          except KeyError:
            print("Warning: Year not found")
            
          try: 
            row["semester"] = row["Term"].split(" ")[1].lower()
            row.pop("Term")
          except KeyError:
            print("Warning: Semester or Term not found")
            
          try: 
            row["career"] = row.pop("Course Career").lower()
            row.pop("Academic Career")
          except KeyError:
            print("Warning: Course Career or Academic Career not found")
          
          try: 
            row["instructor"] = "".join(row.pop("Primary Instructor First Name") + " " + row.pop("Primary Instructor Last Name")).lower()
          except KeyError:
            print("Warning: Primary Instructor not found")
          
          row.pop("Non Primary Instructors")

          # try:
            # instructors = row.pop("Non Primary Instructors").split(", ")
          #   for i in range(1, 5):
          #     if i <= len(instructors):
          #       row[f"instructor{i+1}"] = instructors[i-1].lower()
          #     else:
          #       row[f"instructor{i+1}"] = ""
          # except KeyError:
          #   print("Warning: Non Primary Instructor(s) not found")
            
          # for i in range(1, 5):
          #   instructor_row = row[f"instructor{i}"].lower().strip()
          #   if instructor_row == "" or instructor_row == " " or (instructor_row.count("no") and instructor_row.count("instructor")):
          #     for j in range(i, 4):
          #       row[f"instructor{j}"] = row[f"instructor{j+1}"].lower()
          #     row[f"instructor{6-i}"] = ""
            
          try:
            row.pop("\ufeffAcademic Year")
          except KeyError:
            print("Warning: Academic Year not removed")
            
          try:
            grades_counts = {}
            for grade in ["A", "B", "C", "D", "F", "I", "P", "Q", "W", "Z", "R"]:
              grades_counts[grade] = int(row["grades"].get(grade, 0))

            A_count = grades_counts["A"]
            B_count = grades_counts["B"]
            C_count = grades_counts["C"]
            D_count = grades_counts["D"]
            F_count = grades_counts["F"]
            I_count = grades_counts["I"]
            P_count = grades_counts["P"]
            Q_count = grades_counts["Q"]
            W_count = grades_counts["W"]
            Z_count = grades_counts["Z"]
            R_count = grades_counts["R"]

            total_students = A_count + B_count + C_count + D_count + F_count + P_count + R_count
            total_attempted = total_students + I_count + P_count + W_count + Q_count + Z_count + R_count

            total_grade_points = A_count*4 + P_count*4 + R_count*4 + B_count*3 + C_count*2 + D_count*1 + F_count*0

            if total_students > 0:
              gpa = total_grade_points / total_students
            else:
              gpa = None

            if total_attempted > 0:
              drop_percent = (W_count + Q_count) / total_attempted * 100
            else:
              drop_percent = None
                
            if gpa is None and I_count > 0:
              gpa = 0

            row["gpa"] = round(gpa, 2) if gpa is not None else None
            row["dropPercent"] = round(drop_percent, 2) if drop_percent is not None else None
            
            if gpa is None:
              print(f"Warning: no course_gpa for {row['subjectId']} {row['courseNumber']} {row['sectionNumber']}")
              print(row)
            
            if drop_percent is None:
              print(f"Warning: no drop_percent for {row['subjectId']} {row['courseNumber']} {row['sectionNumber']}")
          except Exception as e:
            print(f"Error computing course_gpa and drop_percent: {e}")
              
          unique_years.add(row["year"])
          unique_semesters.add(row["semester"])
          unique_careers.add(row["career"])
          unique_subjectIds.add(row["subjectId"])
          unique_courseNumbers.add(row["courseNumber"])
          unique_sectionNumbers.add(row["sectionNumber"])
          unique_gpas.add(row["gpa"])
          unique_courses.add(f"{row['subjectId']} {row['courseNumber']}")
          unique_terms.add(f"{row['year']} {row['semester']}")

          course_key = f"{row['subjectId']} {row['courseNumber']}"
          if course_key not in course_prof_mapping:
            course_prof_mapping[course_key] = set()
          course_prof_mapping[course_key].add(row["instructor"])

          # for i in range(1, 6):
          #     instructor = row.get(f"instructor{i}", "").strip()
          #     if instructor:
          #         unique_instructors.add(instructor)
          
          unique_instructors.add(row["instructor"])
              
          combined_data.append(row)

      print(f"Processed {filename}")
      total_data.append(combined_data)
      
      with open(f"public/data/{get_current_directory()}/{str(filename).split(".")[0]}.json", "w", encoding="utf-8") as json_file:
        json.dump(combined_data, json_file, indent=2)
    
    with open(f"{current_directory}/public/data/{get_current_directory()}/allgradedata.json", "w", encoding="utf-8") as json_file:
        json.dump(total_data, json_file, indent=2)
    
    unique_values = {
      "year": sorted(unique_years),
      "semester": sorted(unique_semesters),
      "career": sorted(unique_careers),
      "instructor": sorted(unique_instructors),
      "subjectId": sorted(unique_subjectIds),
      "courseNumber": sorted(unique_courseNumbers),
      "sectionNumber": sorted(unique_sectionNumbers),
      "gpa": sorted(unique_gpas)
    }

    with open(f"{current_directory}/public/data/grade_config.js", "w", encoding="utf-8") as f:
      f.write("export const config_data = ")
      json.dump(unique_values, f, indent=2)
      f.write("\n\nexport const data_course = ")
      json.dump(sorted(list(unique_courses)), f, indent=2)
      f.write("\n\nexport const data_term = ")
      json.dump(sorted(list(unique_terms)), f, indent=2)
      f.write("\n\nexport const data_course_prof = ")
      json.dump({k: list(v) for k, v in course_prof_mapping.items()}, f, indent=2)


if __name__ == "__main__":
  current_directory = os.getcwd()
  currdirr = get_current_directory()
  csv_to_combined_json(f"{current_directory}/public/data/{currdirr}/raw")
