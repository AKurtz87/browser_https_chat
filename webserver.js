// WSS (NOT READY SOME BUGS TO FIX)
//
const express = require("express");
const app = express();
const https = require("https");

const fs = require("fs");
const path = require("path");

const WebSocket = require("ws");
const server = https.createServer(express);
const wss = new WebSocket.Server({ server });
const port = 6969;

const csr = fs.readFileSync("./modernjsbook.crt");
const key = fs.readFileSync("./modernjsbook.key");
//
wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        let msg = data.toString("utf8");
        client.send(msg);
      }
    });
  });
});

https.createServer({ csr, key }, app).listen(6969);
