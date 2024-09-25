# UTA Grade Data Info

## License

The data provided within the software is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** license. The license can be found [here](../../LICENSE).

## Maintenance

1. Add new grade data to the `public/data/raw` directory.
2. In a terminal, run `node run process` to process the raw data and update the `public/data/grades.sqlite` database.
   - Note: This requires Node/NPM and Python to be installed on a machine.
   - Note: If there are dependency errors, run `npm install` in the root directory to install the necessary dependencies.

## Requesting New Grade Data

Email to `records@uta.edu` with the following template:

```md
Dear Registrar’s Office,

I hope this message finds you well, my name is **INSERT YOUR NAME HERE**, and I am writing this on behalf of the Association for Computing Machinery at UTA (ACM). We are looking to access the grade distribution records and data for the purpose of designing a website to display these statistics, enhancing academic transparency and aiding students in course selection through the Freedom of Information Act (FOIA).

We would like to request data on grade distributions for the following semesters: **INSERT EACH SEMESTER (Spring/Summer/Fall) INDIVIDUALLY HERE**

The specific data we are looking for are as follows. Note that the data should follow this exact csv format: 
- Academic Year
- Term
- Academic Career
- Course Career
- Primary Instructor First Name
- Primary Instructor Last Name
- Non Primary Instructors
- Subject
- Catalog Number
- Section Number
- A
- B
- C
- D
- F
- I
- P
- Q
- W
- Z
- R
- Total Grades

An example row of the csv data we are looking for is as follows:
- 2020 - 2021,2020 Fall,GRAD,GRAD,Choong-Un,Kim,"Anthony Martinez, Kimaya Vyavhare, Pushkar Kiran Gothe, Yao Ren, Yi Ram Kim",MSE,5304,001,8,7,0,0,0,0,0,0,0,0,15

Every semester requested should be in its own independent csv file. For more examples of previous data requested, please see here: https://github.com/acmuta/utagrades/tree/main/public/data.

Thanks,
**INSERT YOUR NAME HERE**
```
