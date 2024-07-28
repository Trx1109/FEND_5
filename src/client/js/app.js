const moment = require("moment")

// Function for init eventListener
export const initAllListener = () => {
    document.getElementById("form").addEventListener("submit", onSubmit)
    let dateInput = document.getElementById("date")
    dateInput.min = moment().format("YYYY-MM-DD")
    dateInput.max = moment().add(15, "days").format("YYYY-MM-DD")
}


// Function handle when submit form
export const onSubmit = async (e) => {
    e.preventDefault()
    clearResultUI()
    let location = document.getElementById("location").value
    let date = document.getElementById("date").value
    let validateLocationRes = Client.validateInputLocation(location)
    let validateDateRes = Client.validateInputDate(date)
    if (!validateDateRes || !validateLocationRes) {
        document.getElementById("error").innerText = "Invalid Input"
        return;
    }
    pendingUI()
    let encodedLocation = encodeValue(location.trim())
    let formatedDate = moment(date).format("YYYY-MM-DD")
    try {
        let geoInfo = await Client.getGeoInfo(encodedLocation)
        let weatherInfos = await Client.getWeatherInfo(geoInfo.lat, geoInfo.lon, formatedDate)
        let locationImage = await Client.getImageInfo(geoInfo.country)
        let currentTrips = await Client.getTrips()
        updateResultUI(formatedDate, geoInfo, weatherInfos, locationImage, currentTrips)
    } catch (exception) {
        alert(exception)
        nodataUI()
    }
}

// Function update result into UI
export const updateResultUI = (dateSubmit, geoInfo, weatherInfos, locationImage, currentTrips) => {
    let locationImageTag = `<img class="result-image" src=${locationImage} />`
    let travelInfoTag = `
        <div class="travel-info" >
            <div class="travel-child-info">
                <i class="bi bi-geo-alt-fill"></i>
                <p>Location: ${geoInfo.country}</p>
            </div>
            <div class="travel-child-info">
                <i class="bi bi-calendar-date-fill"></i>
                <p>Travel date: ${formatDate(dateSubmit)}</p>
            </div >
        </div >
    `
    let weatherInfoChilds = weatherInfos.map(x => `
        <div class="weather-info">
            <div class="date-info">
                ${formatDate(x.date)}
            </div>
            <div class="child-info">
                <i class="bi bi-thermometer-low"></i>
                <p>${x.minTemp}°C</p>
            </div>
            <div class="child-info">
                <i class="bi bi-thermometer-high"></i>
                <p>${x.maxTemp}°C</p>
            </div>
            <div class="child-info">
                <i class="bi bi-brightness-high-fill"></i>
                <p>UV: ${x.uv}</p>
            </div>
            <div class="child-info">
                <i class="bi bi-cloud-rain-fill"></i>
                <p>Probability of precipitation: ${x.percentRain}%</p>
            </div>
            <div class="child-info">
                <i class="bi bi-snow"></i>
                <p>Snow: ${x.snow}mm</p>
            </div>
            <div class="child-info">
                <p>Description: ${x.description}</p>
            </div>
        </div>
    `)
    let weatherInfoTitle = ` 
        <div div class="weather-info-title" >
            Weather info
        </div>
    `
    let weatherInfoTag = weatherInfoTitle + weatherInfoChilds.join("")
    let isSaved = currentTrips.find(x => x.geonameId === geoInfo.geonameId && x.dateSubmit === dateSubmit) ? true : false
    let buttonWrapper = `
        <div class="result-action">
            <button id="save-btn" class="button-save">Save trip</button>
            <button id="delete-btn" class="button-delete">Delete trip</button>
        </div>
    `
    let resultTag = document.getElementById("result-content")
    resultTag.innerHTML = locationImageTag + travelInfoTag + weatherInfoTag + buttonWrapper
    updateBtnStatus(isSaved, geoInfo.geonameId, dateSubmit)
}

const clearResultUI = () => {
    document.getElementById("error").innerText = ""
    document.getElementById("result-content").innerHTML = ""
    document.getElementById("result-content").classList.remove("show")
}

const pendingUI = () => {
    document.getElementById("result-content").innerHTML = `<div class="pending-wrapper"><div class="loading"></div> Searching...</div>`
    document.getElementById("result-content").classList.add("show")
}

const nodataUI = () => {
    document.getElementById("result-content").innerHTML = `<div class="pending-wrapper">No data to show</div>`
    document.getElementById("result-content").classList.add("show")
}

const encodeValue = (userInput) => {
    const encoded = encodeURIComponent(userInput);
    return encoded;
}

const saveTrip = async (geonameId, dateSubmit) => {
    try {
        let result = await Client.saveTrip(geonameId, dateSubmit)
        updateBtnStatus(true, geonameId, dateSubmit)
        alert("Save trip successfully")
    } catch (exception) {
        alert(exception)
    }
}


const deleteTrip = async (geonameId, dateSubmit) => {
    try {
        let result = await Client.deleteTrip(geonameId, dateSubmit)
        updateBtnStatus(false, geonameId, dateSubmit)
        alert("Delete trip successfully")
    } catch (exception) {
        alert(exception)
    }
}

const updateBtnStatus = (isSaved, geonameId, dateSubmit) => {
    if (isSaved) {
        document.getElementById("delete-btn").classList.add("active")
        document.getElementById("delete-btn").addEventListener("click", () => deleteTrip(geonameId, dateSubmit))
        document.getElementById("save-btn").classList.remove("active")
    } else {
        document.getElementById("delete-btn").classList.remove("active")
        document.getElementById("save-btn").classList.add("active")
        document.getElementById("save-btn").addEventListener("click", () => saveTrip(geonameId, dateSubmit))

    }
}

const formatDate = (date) => {
    return moment(date).format("DD MMM YYYY");
}
