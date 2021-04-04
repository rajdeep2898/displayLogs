const express = require("express");
const app = express();
const port = 3000;

const lastLines = require("./utils.js").lastLines;
const newLines = require("./utils.js").newLines;

const fs = require("fs");
const https = require("http");
const WebSocket = require("ws");

const server = https.createServer(app);
const wss = new WebSocket.Server({ server: server });
const LOGFILE = "logfile";

let connections = [];
let lastLine;

app.get("/log", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

wss.on("connection", function connection(ws) {
  // console.log("A new client Connected!");
  // ws.send("Welcome New Client!!!");
  // ws.on("message", function incoming(message) {
  //   console.log("received: %s", message);
  // });
  lastLines(LOGFILE)
    .then((lines) => {
      ws.send(JSON.stringify({ filename: LOGFILE, lines }));
    })
    .catch((err) => {
      ws.send(JSON.stringify(err));
    });
  ws.on("close", function (ws) {
    let i = connections.indexOf(ws);
    connections.splice(i, 1);
  });
});

fs.watchFile(LOGFILE, { interval: 100 }, (curr, prev) => {
  if (curr.ctimeMs == 0) {
    connections.forEach((c) => {
      c.send(JSON.stringify({ error: "File doesn't exists at the moment." }));
    });
  } else if (curr.mtime !== prev.mtime) {
    // console.log("test");
    newLines(LOGFILE, lastLine)
      .then((lines) => {
        // linesData = lines.lines;
        // lastLine = lines.lastLine;
        console.log(lines);
        console.log(connections);
        if (lines.length > 0) {
          connections.forEach((c) => {
            c.send(JSON.stringify({ filename: LOGFILE, lines }));
          });
        }
      })
      .catch((error) => {
        connections.forEach((c) => {
          c.send(JSON.stringify({ error }));
        });
      });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World1!");
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
