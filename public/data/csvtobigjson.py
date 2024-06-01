import os
import csv
import json

# Copyright (c) 2024 Ryan Lahlou
# This script reads all CSV files in the current directory and cleans + combines them into a single JSON file.

def csv_to_combined_json(directory):
  combined_data = []

  for filename in os.listdir(directory):
    if filename.endswith(".csv"):
      file_path = os.path.join(directory, filename)
      
      with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
          try:
            row["subject_id"] = row.pop("Subject")
          except KeyError:
            print("Warning: Subject not found")
          
          try: 
            row["course_number"] = row.pop("Catalog Number")
          except KeyError:
            print("Warning: Catalog Number not found")
            
          try:
            row["section_number"] = row.pop("Section Number")
          except KeyError:
            print("Warning: Section Number not found")
          
          try:
            row["grades"] = {"A": row["A"], "B": row["B"], "C": row["C"], "D": row["D"], "F": row["F"], "I": row["I"], "P": row["P"], "Q": row["Q"], "W": row["W"], "Z": row["Z"]}
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
          except KeyError:
            print("Warning: Grades not found")
            
          try: 
            row["grades_count"] = row.pop("Total Grades")
          except KeyError:
            print("Warning: Total Grades not found")
            
          try:
            row["year"] = row["Term"].split(" ")[0]
          except KeyError:
            print("Warning: Year not found")
            
          try: 
            row["semester"] = row["Term"].split(" ")[1]
            row.pop("Term")
          except KeyError:
            print("Warning: Semester or Term not found")
            
          try: 
            row["career"] = row.pop("Course Career")
            row.pop("Academic Career")
          except KeyError:
            print("Warning: Course Career or Academic Career not found")
          
          try: 
            row["instructor1"] = "".join(row.pop("Primary Instructor First Name") + " " + row.pop("Primary Instructor Last Name"))
          except KeyError:
            print("Warning: Primary Instructor not found")
          
          try:
            instructors = row.pop("Non Primary Instructors").split(", ")
            for i in range(1, 5):
              if i <= len(instructors):
                row[f"instructor{i+1}"] = instructors[i-1]
              else:
                row[f"instructor{i+1}"] = ""
          except KeyError:
            print("Warning: Non Primary Instructor(s) not found")
            
          try:
            row.pop("\ufeffAcademic Year")
          except KeyError:
            print("Warning: Academic Year not removed")
              
          print(row)
          combined_data.append(row)

  with open("gradedata.json", "w", encoding="utf-8") as json_file:
    json.dump(combined_data, json_file, indent=4)


if __name__ == "__main__":
  current_directory = os.getcwd()
  csv_to_combined_json(current_directory)
