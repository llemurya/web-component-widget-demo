import TomorrowAPI from "./modules/TomorrowApi";
import { getCityCoordinates } from "./modules/citiesCoordinates";
import { DateTime } from "luxon";

class WeatherWidget extends HTMLElement {
  timeline = null;
  constructor() {
    super();
    console.log("[constructor]");
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    this.currentCity = getCityCoordinates(this.city, this.countryCode);
    const weatherAPI = new TomorrowAPI(this.currentCity);
    console.log("[connectedCallback]", this.currentCity);

    this.timeline = await weatherAPI.fetchTimeline();
    this.render();
  }
  disconnectedCallback() {
    console.log("[disconnectedCallback]");
  }

  render() {
    this.shadowRoot.innerHTML = this.timeline
      ? `
      <style>
      .container{
        background-color:#fff;
        display:flex;
        flex-direction:row;
        border-radius:10px;
        margin:10px;
        }
      .container .tile{
        display:flex;
        flex-direction: row;
        }
      .container .country-title{
        font-size:15px;
      }
      .container .city-title{
        font-size:30px;
      }
      .container .column{
        display:flex;
        flex-direction:column;
      }
      .container .row{
        display:flex;
        flex-direction:row;
      }
      .container .padding-10{
        padding:10px;
      }
      .container .padding-5{
        padding:5px;
      }

    </style>
      <div class='container'>
      <div class='column padding-10'>
      <span class="city-title padding-10">${this.currentCity.name}</span>
      <span class="country-title padding-10">${this.currentCity.country}<span>
      </div>
      <div class="row">
      
    ${this.timeline?.intervals
      .map((interval) => {
        console.log("[interval in loop]", interval);
        return `
        <div class="column padding-10">
        <div class="padding-5">${DateTime.fromISO(interval.startTime).toFormat("'At' HH:mm a")}</div>
        <div class="padding-5">Humidity: ${interval?.values?.humidity || ""}%</div>
        <div class="padding-5">Temperature: ${interval?.values?.temperature || ""}&deg;C</div>
        <div class="padding-5">Feels like: ${interval?.values?.temperatureApparent || ""}&deg;C</div>
        <div class="padding-5">Wind Speed: ${interval?.values?.windSpeed || ""}</div>
        </div>
        `;
      })
      .join("")}
      </div>
    </div>`
      : `Loading ...`;
  }

  static get observedAttributes() {
    return ["city", "country-code"];
  }

  get city() {
    return this.getAttribute("city");
  }

  get countryCode() {
    return this.getAttribute("country-code");
  }
  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log("[attributeChangedCallback]", attrName, oldVal, newVal);
  }
}

customElements.define("weather-widget", WeatherWidget);
