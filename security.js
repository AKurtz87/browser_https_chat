"use strict";

const express = require("express");
const app = express();
const https = require("https");

const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const fs = require("fs");
const path = require("path");

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(cookieParser());

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

// HTTPS SERVER

const user = ["alessio0", "marco1", "lele2"];
const password = ["secret", "secret", "secret"];

// a variable to save a session
let session;

//

app.get("/", (req, res) => {
  session = req.session;
  console.log(session.userid);
  if (session.userid) {
    res.sendFile("views/chat.html", { root: __dirname });
  } else res.sendFile("views/login.html", { root: __dirname });
});

app.post("/login", (req, res) => {
  let a = req.body.username;
  let b = req.body.password;
  let c = a.slice(-1);
  console.log(a, b, c);

  if (a == user[c] && b == password[c]) {
    //const nome = "alessio";
    session = req.session;
    session.userid = req.body.username;
    console.log(session.userid);
    res.sendFile("views/chat.html", { root: __dirname });
    res.cookie("user", `${session.userid}`, { path: "/" });
  } else {
    res.sendFile("views/login.html", { root: __dirname });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

const ca = fs.readFileSync("./modernjsbook.csr");
const cert = fs.readFileSync("./modernjsbook.crt");
const key = fs.readFileSync("./modernjsbook.key");

https.createServer({ ca, cert, key }, app).listen(8443);
