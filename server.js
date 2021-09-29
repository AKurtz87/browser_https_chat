"use strict";

const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const https = require("https");

const fs = require("fs");
const path = require("path");

const app = express();

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// cookie parser middleware
app.use(cookieParser());

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

//username and password

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

// HTTPS ELEMENTS

const ca = fs.readFileSync("./pem/ca.csr");

const csr = fs.readFileSync("./pem/csr.crt");

const key = fs.readFileSync("./pem/key.key");

https.createServer({ ca, csr, key }, app).listen(8443);
