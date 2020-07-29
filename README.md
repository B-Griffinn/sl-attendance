# sl-attendance

## About

Welcome to sl-attendance. This is a small tool I made to easily keep track of attendance, both TLs and students. This program prints a list of 2 things at this time:

- TLs who need to submit attendance
- Students who's absences are between 8 and 30 hours (if I include over 30 hours absent, the list is full of MIA folks, withdrawn folks, etc.)

## Set Up

It takes some steps. I appreciate your patience.

1. Clone this project; fork not necessary.
2. Download the attendance data from your dashboard (go the bottom of the attendance view and look for the download icon ⬇).
3. Save that file in the root directory (i.e. inside the sl-attendance directory).
4. Update the `dataPath` variable in index.js so that it leads to the file you just downloaded.
5. CD to the `sl-attendance` directory in your terminal and run `npm i` to install the needed dependencies.

## Usage

- Run `npm start` in your terminal in the sl-attendance directory
- Read the attendance bot's announcements in the terminal.

## FAQ

- How does it calculate the actual number of hours?
  - The student guide says each attendance counts for 4 hours, so I used that measure.
