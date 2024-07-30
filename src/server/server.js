const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "dist" directory
app.use(express.static("dist"));

// Route for root
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/dist/index.html");
});

// API routes
app.get("/trip", function (req, res) {
  let currentTrips = JSON.parse(localStorage.getItem("trips") || "[]");
  res.send(currentTrips);
});

app.post("/trip", function (req, res) {
  let geonameId = req.body.geonameId;
  let dateSubmit = req.body.dateSubmit;
  let currentTrips = JSON.parse(localStorage.getItem("trips") || "[]");
  currentTrips.push({ geonameId: geonameId, dateSubmit: dateSubmit });
  localStorage.setItem("trips", JSON.stringify(currentTrips));
  res.send(currentTrips);
});

app.delete("/trip", function (req, res) {
  let geonameId = req.query.geonameId;
  let dateSubmit = req.query.dateSubmit;
  let currentTrips = JSON.parse(localStorage.getItem("trips") || "[]");
  let newTrips = currentTrips.filter(
    (x) => String(x.geonameId) !== geonameId || x.dateSubmit !== dateSubmit
  );
  localStorage.setItem("trips", JSON.stringify(newTrips));
  res.send(newTrips);
});

module.exports = app;
