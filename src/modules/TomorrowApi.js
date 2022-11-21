export default class TomorrowAPI {
  constructor(props) {
    Object.assign(this, props);
  }

  get instance() {
    return this;
  }

  get baseUrl() {
    return process.env.TOMORROW_API_URL;
  }

  get apiKey() {
    return process.env.TOMORROW_API_KEY;
  }

  get fieldsQueryString() {
    return `&fields=temperature&fields=temperatureApparent&fields=humidity&fields=windSpeed`;
  }

  get otherParamsQueryString() {
    return `&units=metric&timesteps=1h&startTime=now&endTime=nowPlus6h`;
  }

  get apiUrl() {
    return this.prepareApiUrl();
  }

  get prepareApiUrl() {
    return new URL(
      `?location=${this.lat},${this.lng}&apikey=${this.apiKey}${this.otherParamsQueryString}${this.fieldsQueryString}`,
      this.baseUrl
    ).toString();
  }

  async fetchTimeline() {
    const response = await fetch(this.prepareApiUrl);
    const json = await response.json();
    return json?.data?.timelines?.[0];
  }
}
