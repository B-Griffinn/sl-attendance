const fs = require("fs");
const Papa = require("papaparse");
const config = require("./config");
const { Console } = require("console");

class AttendanceProcessor {
  constructor() {
    this.data = [];
    this.tls = new Set();
    //student = record[1]
    // notes = record[3];
    // isPresent = record[4];
    // startOrStandUp = record[6];
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
    let csvPath = "C:/Users/irads/Desktop/coding/attendance-processor/data.csv";
    try {
      await this.readCSV(csvPath);
    } catch {
      console.log("error");
    }
  }

  makeListOfTLs() {
    for (let i = 1; i < this.data.length; i++) {
      let record = this.data[i];
      let tl = record[0];
      this.tls.add(tl);
    }
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

  calculateLast30DaysOfAbsences() {
    console.log();
    return;
  }

  async process() {
    console.log(
      "\n\n\t( ✪ ω ✪ ): Hi there, welcome to AttendanceProcessor! I will process who's submitted attendance for today and which students are at 8 hours of total absences in the last 30 days.\n\n"
    );
    this.getData(); //getData asks readCSV to read the CSV and save data to the class

    this.makeListOfTLs(); //makes a list of the tl's listed in the records

    //find who forgot and make list to show
    console.log(
      "\n▶ PLEASE REMIND THESE TLS TO SUBMIT ATTENDANCE FOR TODAY: ◀\n",
      this.findTLsWhoForgotToSubmit(),
      "\n\n"
    );
  }
}

test = new AttendanceProcessor();

test.process();
