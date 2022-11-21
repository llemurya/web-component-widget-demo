import { cities } from "country-city-location";
import { filter, upperFirst } from "lodash";

export const getCityCoordinates = (cityName, countryCode) => {
  return (
    filter(cities, {
      name: upperFirst(cityName),
      countryCode: countryCode?.toUpperCase(),
    }).pop() || null
  );
};
