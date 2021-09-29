// WEBSOCKET SERVER (PLAIN WS)
//
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });
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
//
server.listen(6969, () => console.log(`Server Running at port 6969`));
