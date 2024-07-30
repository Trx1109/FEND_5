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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/views/service-worker.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed: ", error);
      });
  });
}

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
