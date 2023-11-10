/**
 * case : contoh datanya ini  ['', 'Ny  SRI ANGGRAINI', ' ANGGRAINI', '30-09-2021', '-2021', 'FO-21090018TA', '-21090018TA', ' ', 'Ny  ERNI ARSYAD', ' ARSYAD', '30-09-2021', '-2021', 'FO-21090019TA', '-21090019TA', ' ', 'Ny  ITJE AGNES SANGKI', ' SANGKI', '30-09-2021', '-2021', 'FO-21090020TA', '-21090020TA', '']
untuk data yang valid di dalam array nya itu udah ada pola nya, data validnya index ke 1,3,5 untuk data pertama, data ke 2 di index nya di tambahin dulu 3 misal 5+3=8 nah index ke 8 datakedua di klipatan 2, jadinya 8,10,12.. gitu strusnya,, gmana cara ngambil datanya?
 */

/** code 1 */
const data = [
  "",
  "Ny  SRI ANGGRAINI",
  " ANGGRAINI",
  "30-09-2021",
  "-2021",
  "FO-21090018TA",
  "-21090018TA",
  " ",
  "Ny  ERNI ARSYAD",
  " ARSYAD",
  "30-09-2021",
  "-2021",
  "FO-21090019TA",
  "-21090019TA",
  " ",
  "Ny  ITJE AGNES SANGKI",
  " SANGKI",
  "30-09-2021",
  "-2021",
  "FO-21090020TA",
  "-21090020TA",
  "",
];
const newData = [];

let firstIndex = 1;
let temp = [];
data.map((d, i) => {
  let secondIndex = firstIndex + 2;
  let thirdIndex = firstIndex + 4;

  if (i == firstIndex || i == secondIndex || i == thirdIndex) {
    temp.push(d);
    //     console.log(temp);
  } else if (i == firstIndex + 6) {
    firstIndex = i + 1;

    newData.push(temp);
    temp = [];
  } else {
    // TODO
  }
});

console.log(newData);

/** code 2 */
let currentData = [...data];
const dataLengthPerCheck = 7;
const cleanData = [];
while (currentData.length >= dataLengthPerCheck) {
  const indices = [1, 3, 5];
  const newData = [];
  for (const index of indices) {
    newData.push(currentData[index]);
  }
  cleanData.push(newData);
  currentData = currentData.slice(dataLengthPerCheck);
}

console.log(cleanData);
