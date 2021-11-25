// Création du composant qui va utiliser des props avec des propriétés propres à chaque instance du composant
const Prevision = {
  props: [
    "city",
    "population",
    "weather",
    "temperature",
    "tempMin",
    "tempMax",
    "wind",
  ],

  // Affichage dynamique sur la page HTML
  template: `

  <div class="weather-card">
    <p>Ville: {{city}} </p>
    <p>Population: {{population}} habitants</p>
    <p>Météo: {{weather}} </p>
    <p>Température actuelle: {{temperature}} °C</p>
    <p>Température minimale: {{tempMin}} °C</p>
    <p>Température maximale: {{tempMax}} °C</p>
    <p>Vitesse du vent: {{wind}} km/h</p>
  </div>

`,
};

// Création du composant racine
const RootComponent = {
  components: {
    "component-block": Prevision,
  },

  data() {
    return {
      thisWeatherList: [],
      city: "",
      population: 0,
      weather: 0,
      temperature: 0,
      tempMin: 0,
      tempMax: 0,
      wind: 0,
    };
  },

  // Méthode permettant d'obtenir la météo via une API, basée sur notre géolocalisation
  methods: {
    getForecastHere() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const url =
          "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          lat +
          "&lon=" +
          lng +
          "&appid=04b7b6201b4d22c856e6c5e4f89463f1&units=metric&lang=fr";
        const response = await fetch(url);
        const forecastData = await response.json();
        this.city = forecastData.city.name;
        this.population = forecastData.city.population;
        this.weather = forecastData.list[0].weather[0].main;
        this.temperature = forecastData.list[0].main.temp;
        this.tempMin = forecastData.list[0].main.temp_min;
        this.tempMax = forecastData.list[0].main.temp_max;
        this.wind = forecastData.list[0].wind.speed;
      });
    },

    // Méthode permettant d'obtenir la météo d'une ville de notre choix
    async getForecast() {
      const url =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        this.city +
        ",fr&appid=04b7b6201b4d22c856e6c5e4f89463f1&units=metric&lang=fr";
      const response = await fetch(url);
      const forecastData = await response.json();
      this.city = forecastData.city.name;
      this.population = forecastData.city.population;
      this.weather = forecastData.list[0].weather[0].main;
      this.temperature = forecastData.list[0].main.temp;
      this.tempMin = forecastData.list[0].main.temp_min;
      this.tempMax = forecastData.list[0].main.temp_max;
      this.wind = forecastData.list[0].wind.speed;
    },
  },

  template: `

  <h1>Votre Météo du jour en France</h1>

  <input @keyup.enter="getForecast" placeholder="Saisissez votre ville ici" v-model="city" />
    <button class="glow-on-hover" @click="addPrevision" @click="getForecast">Valider</button>
    <button class="glow-on-hover" @click="getForecastHere">Prévision chez vous</button>


    <div class="weather-cards-container">
  <component-block :city="city" :population="population" :weather="weather" :temperature="temperature" :tempMin="tempMin" :tempMax="tempMax" :wind="wind" />
    </div>
    `,
};

Vue.createApp(RootComponent).mount("#root");
