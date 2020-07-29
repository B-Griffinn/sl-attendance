const fs = require("fs");
const Papa = require("papaparse");
const config = require("./config");

class AttendanceProcessor {
  constructor() {
    this.data = [];
    this.dataPath = "C:/Users/irads/Desktop/sl-attendance/data.csv"; // ◀◀◀ UPDATE THIS LINE WITH YOUR DOWNLOADED CSV
    //⚠⚠⚠ THIS MUST BE THE WHOLE FILE PATH OR IT WON'T WORK
    this.students = new Map();
    this.tls = new Set();
    this.today = new Date();
    this.day = this.today.getDate();
    this.month = this.today.getMonth() + 1; // getMonth is 0 indexed
    this.year = this.today.getFullYear();
  }

  async readCSV(path) {
    const csvFile = fs.readFileSync(path);
    const csvData = csvFile.toString();
    let { data } = Papa.parse(csvData, config);

    this.data = data;
  }

  async getData() {
    try {
      await this.readCSV(this.dataPath);
    } catch {
      console.log("error");
    }
  }

  makeListOfTLsAndStudents() {
    let { data, tls, students } = this;
    let removedDuplicates = new Set();
    let totalHoursAbsent = 0; //starting point to add to later

    for (let i = 1; i < data.length; i++) {
      let record = data[i];

      //add tl
      let tl = record[0];
      tls.add(tl);

      //add student
      let name = record[1];
      removedDuplicates.add(name);
    }

    removedDuplicates.forEach((name) => {
      //move to a Map for easier search
      students.set(name, totalHoursAbsent);
    });
  }

  findTLsWhoForgotToSubmit() {
    let { day, month, year, tls } = this;
    // make a date string for today's date that matches the records' format
    let dateString = `${year}-0${month}-${day}`; //e.g. 2020-07-28

    // get records from today
    let todaysRecords = this.data.filter((record) => {
      let recordDate = record[5];

      return dateString === recordDate;
    });

    //make a list of tl's who have submitted today
    let tlsWhoHaveSubmittedToday = new Set();
    todaysRecords.forEach((record) => {
      let tl = record[0];
      tlsWhoHaveSubmittedToday.add(tl);
    });

    //find tl's not listed in today's records
    //by comparing to the total tl list
    // this 🔽 allows me to use the filter method on a set

    return [...tls].filter((tl) => {
      return !tlsWhoHaveSubmittedToday.has(tl);
    });
  }

  calculateAbsences() {
    //get records of absences
    let { data, students } = this;

    //filter for absences
    let absences = data.filter((record) => {
      let isPresent = record[4].toLowerCase();

      return isPresent === "false";
    });

    //go through absences and tally up the total values for each student
    absences.forEach((record) => {
      let name = record[1];
      let notes = record[3];

      let currentHours = students.get(name);
      let hours = currentHours.hours ? currentHours.hours + 4 : 4; //starting point is 0, object added if above 0

      students.set(name, { name, notes, hours });
    });

    let listToConsiderForEscalation = [];

    students.forEach((student) => {
      if (typeof student !== "number") {
        //this means they've had absent-related data added to them; otherwise, it'd be 0

        if (student.hours >= 8 && student.hours <= 30) {
          listToConsiderForEscalation.push(student);
        } else {
          // console.log(student.hours);
        }
      }
    });

    listToConsiderForEscalation = listToConsiderForEscalation.sort((a, b) =>
      a.name < b.name ? -1 : 1
    );

    listToConsiderForEscalation.forEach((student) => {
      let { name, notes, hours } = student;
      console.log(name, hours, notes);
    });
  }

  async process() {
    console.log(
      "\n\n( ✪ ω ✪ ):\n\tHi there, welcome to AttendanceProcessor! I will process who's submitted attendance for today and which students are at 8 hours of total absences in the last 30 days.\n\n"
    );
    this.getData(); //getData asks readCSV to read the CSV and save data to the class

    this.makeListOfTLsAndStudents(); //makes a list of the tl's listed in the records

    //find who forgot and make list to show
    let forgot = this.findTLsWhoForgotToSubmit();
    forgot.length > 0
      ? console.log(
          "\n▶ PLEASE REMIND THESE TLS TO SUBMIT ATTENDANCE FOR TODAY: ◀\n",
          forgot,
          "\n\n"
        )
      : console.log(
          "\n\\(@^0^@)/:\n❤ ❤ ❤ ❤ ❤ \nPLEASE THANK YOUR TLS FOR SUBMITTING ATTENDANCE ON TIME TODAY \n❤ ❤ ❤ ❤ ❤\n\n"
        );

    //make list of students who may need to be escalated, depending on whether excused
    console.log(
      "\n\n( ✪ ω ✪ ):\n\n\t▶ PLEASE CHECK IN WITH THESE STUDENTS AND DECIDE IF IT'S APPROPRIATE TO ESCALATE TO STUDENT SUCCESS: \n\n▼ ▼ ▼ ▼ ▼"
    );
    this.calculateAbsences();
  }
}

attendanceBot = new AttendanceProcessor();

attendanceBot.process();
