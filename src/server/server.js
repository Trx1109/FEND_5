const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

app.use(express.static('dist'))

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
let currentTrips = JSON.parse(localStorage.getItem("trips") || "[]")

app.get('/', function (req, res) {
    res.send("This is the server API page, you may access its services via the client app.");
});

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.get('/trip', function (req, res) {
    currentTrips = JSON.parse(localStorage.getItem("trips") || "[]")
    res.send(currentTrips)
})

app.post('/trip', function (req, res) {
    let geonameId = req.body.geonameId
    let dateSubmit = req.body.dateSubmit
    currentTrips.push({ geonameId: geonameId, dateSubmit: dateSubmit })
    localStorage.setItem("trips", JSON.stringify(currentTrips))
    res.send(currentTrips)
})

app.delete('/trip', function (req, res) {
    let geonameId = req.query.geonameId
    let dateSubmit = req.query.dateSubmit
    let newTrips = currentTrips.filter(x => String(x.geonameId) !== geonameId || x.dateSubmit !== dateSubmit)
    localStorage.setItem("trips", JSON.stringify(newTrips))
    res.send(newTrips)
})

module.exports = app


