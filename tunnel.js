// TUNNELING : ALL REQS TO HTTP REDIRECTED TO HTTPS

// tunneling all request to http://localhost/*:8080   to  https://localhost/*:8443

"use strict";

const express = require("express");
const app = express();
const http = require("http");

http.createServer(app).listen(8080);

app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect(
      `https://${req.headers.host.replace(/8080/, "8443")}${req.url}`
    );
  }
});
