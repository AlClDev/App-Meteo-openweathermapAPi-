import tabJoursEnOrdre from "./Utilitaire/gestionTemps.js";

const CLEFAPI = "...";
let resultatsAPI;

const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll(".heure-nom-prevision");
const tempPourH = document.querySelectorAll(".heure-prevision-valeur");
const joursDiv = document.querySelectorAll(".jour-prevision-nom");
const tempJoursDiv = document.querySelectorAll(".jour-prevision-temp");
const imgIcone = document.querySelector(".logo-meteo");
const chargementContainer = document.querySelector(".overlay-icone-chargement");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let long = position.coords.longitude;
      let lat = position.coords.latitude;
      AppelAPI(long, lat);
    },
    () => {
      alert(
        `Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner. Veuillez l'activer !`
      );
    }
  );
}

function AppelAPI(long, lat) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`
  )
    .then((reponse) => {
      return reponse.json();
    })
    .then((data) => {
      console.log(data);

      resultatsAPI = data;

      temps.innerText = resultatsAPI.list[0].weather[0].description;
      temperature.innerText = `${Math.trunc(resultatsAPI.list[0].main.temp)}°`;
      localisation.innerText = resultatsAPI.city.name;

      // heure par tranche de 3, avec temperature

      let heureActuelle = new Date().getHours();

      for (let i = 0; i < heure.length; i++) {
        let heureIncr = heureActuelle + i * 3;

        if (heureIncr > 24) {
          heure[i].innerText = `${heureIncr - 24} h`;
        } else if (heureIncr === 24) {
          heure[i].innerText = "00 h";
        } else {
          heure[i].innerText = `${heureIncr} h`;
        }
      }

      //   température tt les 3 heures
      for (let j = 0; j < tempPourH.length; j++) {
        tempPourH[j].innerText = `${Math.trunc(
          resultatsAPI.list[j].main.temp
        )}°`;
      }

      // trois premieres lettre des jours

      for (let k = 0; k < tabJoursEnOrdre.length - 2; k++) {
        joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0, 3);
      }

      //température par jour
      for (let m = 0; m < 5; m++) {
        tempJoursDiv[m].innerText = `${Math.trunc(
          resultatsAPI.list[m * 8].main.temp
        )}°`;
      }

      // Icone météo dynamique
      if (heureActuelle >= 6 && heureActuelle < 21) {
        imgIcone.src = `ressources/jour/${resultatsAPI.list[0].weather[0].icon}.svg`;
      } else {
        imgIcone.src = `ressources/nuit/${resultatsAPI.list[0].weather[0].icon}.svg`;
      }

      //loading
      chargementContainer.classList.add("disparition");
    });
}
