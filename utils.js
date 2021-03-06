const fs = require("fs");
const readline = require("readline");

const lastLines = (filename) => {
  return new Promise((resolve, reject) => {
    fs.accessSync(filename, (error) => {
      reject(error);
    });
    let lines = [];
    let r1 = readline.createInterface({
      input: fs.createReadStream(filename),
      output: process.stdout,
      terminal: false,
    });
    r1.on("error", (error) => {
      reject(error);
    });

    r1.on("line", (input) => {
      lines.push(input);
    });

    r1.on("close", () => {
      //   lastLine = lines.length > 0 ? lines[lines.length - 1] : "";
      resolve(lines.slice(-10));
    });
  });
};

const newLines = (filename, lastLine) => {
  return new Promise((resolve, reject) => {
    fs.accessSync(filename, (error) => {
      reject(error);
    });

    let lines = [];
    let register = false;
    let r1 = readline.createInterface({
      input: fs.createReadStream(filename),
      output: process.stdout,
      terminal: false,
    });

    r1.on("line", (input) => {
      lines.push(input);

      // console.log("lastline", lastLine);

      // if (register || lastLine == "" || lastLine == undefined) {
      //   lines.push(input);
      // } else if (input === lastLine) {
      //   register = true;
      // }
    });

    r1.on("close", () => {
      // lastLine = lines.length > 0 ? lines[lines.length - 1] : "";
      // console.log("test", lastLine);
      // console.log(lines);
      resolve(lines);
    });
  });
};

module.exports = {
  lastLines,
  newLines,
};
