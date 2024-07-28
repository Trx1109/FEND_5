import "bootstrap-icons/font/bootstrap-icons.scss";
import "./styles/layout.scss";
import "./styles/style.scss";
import "./styles/form.scss";
import "./styles/formResult.scss";
import { initAllListener } from "./js/app";
import { validateInputDate, validateInputLocation } from "./js/validate";
import {
    getGeoInfo,
    getImageInfo,
    getWeatherInfo,
    getTrips,
    saveTrip,
    deleteTrip,
} from "./js/callApi";

window.addEventListener("DOMContentLoaded", initAllListener);

export {
    initAllListener,
    validateInputDate,
    validateInputLocation,
    getGeoInfo,
    getImageInfo,
    getWeatherInfo,
    getTrips,
    saveTrip,
    deleteTrip,
};
