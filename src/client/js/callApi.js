// API Constant Value
const geoBaseURL = "https://secure.geonames.org/searchJSON?q=";
const geoApiKey = "trungnt2126";
const weatherBitBaseURL = "https://api.weatherbit.io/v2.0/forecast/daily";
const weatherBitApiKey = "3d923d71c6914c5497cf41cf282643c2";
const pixabayBaseURL = "https://pixabay.com/api/";
const pixabayKey = "43725810-1176870aaacee15635d35eaca";
const serverBaseURL = "http://localhost:8000";

export const getGeoInfo = async (searchName) => {
  try {
    let res = await fetch(geoBaseURL + searchName + "&username=" + geoApiKey);
    let result = await res.json();
    if (result.totalResultsCount > 0) {
      let first = result.geonames[0];
      return {
        geonameId: first.geonameId,
        lat: first.lat,
        lon: first.lng,
        country: first.countryName,
        city: first.toponymName,
      };
    } else {
      throw new Error("No data found");
    }
  } catch (exception) {
    throw new Error("Error while call API get GEONAME: " + exception);
  }
};

export const getWeatherInfo = async (lat, lon, date) => {
  try {
    let res = await fetch(
      `${weatherBitBaseURL}?lat=${lat}&lon=${lon}&key=${weatherBitApiKey}`
    );
    let result = await res.json();
    let indexOfSearchDate = result.data.findIndex((x) => x.datetime === date);
    if (indexOfSearchDate !== -1) {
      let finalResult = [];
      let isHasNext = true;
      let count = 0;
      while (isHasNext) {
        let current = result.data[indexOfSearchDate];
        finalResult.push({
          minTemp: current.min_temp,
          maxTemp: current.max_temp,
          description: current.weather.description,
          percentRain: current.pop,
          uv: current.uv,
          snow: current.snow,
          date: current.datetime,
        });
        indexOfSearchDate = indexOfSearchDate + 1;
        count = count + 1;
        if (indexOfSearchDate >= result.data.length || count === 3) {
          isHasNext = false;
        }
      }
      return finalResult;
    } else {
      throw new Error("No data found");
    }
  } catch (exception) {
    throw new Error("Error while call API get weatherInfo: " + exception);
  }
};

export const getImageInfo = async (country) => {
  try {
    let countryImagesRes = await fetch(
      `${pixabayBaseURL}?key=${pixabayKey}&q=${country}&orientation=horizontal&category=place&safesearch=true`
    );
    let countryImages = await countryImagesRes.json();
    if (countryImages.totalHits > 0) {
      let firstImage = countryImages.hits[0].largeImageURL;
      return firstImage;
    } else {
      throw new Error("No data found");
    }
  } catch (exception) {
    throw new Error("Error while call API get GetImage: " + exception);
  }
};

export const getTrips = async () => {
  try {
    let res = await fetch(`${serverBaseURL}/trip`);
    return await res.json();
  } catch (exception) {
    return [];
  }
};

export const saveTrip = async (geonameId, dateSubmit) => {
  try {
    let res = await fetch(`${serverBaseURL}/trip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        geonameId: geonameId,
        dateSubmit: dateSubmit,
      }),
    });
    return await res.json();
  } catch (exception) {
    throw new Error("Error while save trip: " + exception);
  }
};

export const deleteTrip = async (geonameId, dateSubmit) => {
  try {
    let res = await fetch(
      `${serverBaseURL}/trip?geonameId=${geonameId}&dateSubmit=${dateSubmit}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await res.json();
  } catch (exception) {
    throw new Error("Error while delete trip: " + exception);
  }
};
